import { EscalationPolicyServicePort, EscalationPolicy, Level, TargetType } from './ports/EscalationPolicyServicePort';
import { MailServicePort } from './ports/MailServicePort';
import { SMSServicePort } from './ports/SMSServicePort';
import { TimerServicePort } from './ports/TimerServicePort';
import { PagerRepositoryPort, Dysfunction } from './ports/PagerRepositoryPort';
import { PagerServicePort } from './ports/PagerServicePort';

export class PagerService implements PagerServicePort {
  constructor(
    private epService: EscalationPolicyServicePort,
    private mailService: MailServicePort,
    private smsService: SMSServicePort,
    private timerService: TimerServicePort,
    private pagerRepository: PagerRepositoryPort
  ) { }

  async openIncident(serviceId: number, message: string): Promise<boolean> {
    //Get service dysfunction info
    let dysfunction = await this.pagerRepository.getLast(serviceId);
    if (dysfunction?.isHealthy === false) {
      console.log(`An attempt was made to open an issue for the service ${serviceId}, which is already marked as unhealthy.`);
      return false;
    }

    //Mark monitored service as not healthy: Create dysfunction
    dysfunction = {
      serviceId: serviceId,
      isHealthy: false,
      escalationLevel: 1,
      message: message,
      accepted: false
    };
    const creationResult = await this.pagerRepository.create(dysfunction);
    if (!creationResult) {
      console.log(`Dysfunction not created for service ${serviceId}, maybe because of concurrency.`);
      return false;
    }

    //Escalate incident
    await this.escalateIncident(serviceId, 0, message);
    return true;
  }

  async acceptIncident(serviceId: number): Promise<boolean> {
    let dysfunction = await this.pagerRepository.getLast(serviceId);
    if (!dysfunction || dysfunction.isHealthy === true) {
      console.log(`An attempt was made to accept incident for the service ${serviceId}, which is marked as healthy.`);
      return false;
    }

    if (dysfunction.accepted === true) {
      console.log(`An attempt was made to accept incident already accepted for the service ${serviceId}.`);
      return false;
    }

    //Mark service as accepted
    dysfunction.accepted = true;
    await this.pagerRepository.update(dysfunction);
    return true;
  }

  async closeIncident(serviceId: number): Promise<boolean> {
    //Get service dysfunction info
    const dysfunction = await this.pagerRepository.getLast(serviceId);
    if (!dysfunction || dysfunction.isHealthy === true) {
      throw new Error('Service is working well');
    }

    //Remove timer
    this.timerService.removeTimer(`${serviceId}`);

    //Mark service as healthy
    dysfunction.isHealthy = true;
    await this.pagerRepository.update(dysfunction);
    return true;
  }

  async refreshIncident(serviceId: number): Promise<boolean> {
    //Get service dysfunction info
    const dysfunction = await this.pagerRepository.getLast(serviceId);
    if (!dysfunction || dysfunction.isHealthy === true) {
      console.log(`An attempt was made to refresh an issue for the service ${serviceId}, which is healthy.`);
      return false;
    }

    if (dysfunction.accepted === true) {
      console.log(`An attempt was made to refresh an issue for the service ${serviceId}, which is already accepted.`);
      return false;
    }

    //Escalate incident
    const level = await this.escalateIncident(serviceId, dysfunction.escalationLevel, dysfunction.message);

    //Update incident info
    dysfunction.escalationLevel = level;
    await this.pagerRepository.update(dysfunction);
    return true;
  }

  private async escalateIncident(serviceId: number, currentLevel: number, message: string): Promise<number> {
    //Get Escalation Policy by serviceId
    const escalationPolicy = await this.epService.getEscalationPolicy(serviceId);

    //Get corresponding escalation level
    const escalationLevel = this.getNextEscalationLevel(escalationPolicy, currentLevel);

    //Send notification to all targets of the Policy Level
    this.sendNotificationToTargets(escalationLevel, message);

    //Set Timer to 15 minutes
    this.timerService.setTimer(900, `${serviceId}`);

    return escalationLevel.number;
  }

  private getNextEscalationLevel(escalationPolicy: EscalationPolicy, currentLevel: number): Level {
    const maxLevel = Math.max.apply(Math, escalationPolicy.levels.map(l => l.number));
    let nextLevel = currentLevel + 1;
    if (currentLevel >= maxLevel) {
      //It is supposed that the first level always exists
      nextLevel = 1;
    }
    const escalationLevel = escalationPolicy.levels.find(l => l.number === nextLevel);
    if (!escalationLevel) {
      throw new Error('Level not found in escalation policy!');
    }
    return escalationLevel;
  }

  private sendNotificationToTargets(escalationLevel: Level, message: string): void {
    const targets = escalationLevel.targets;
    for (let target of targets) {
      if (target.type === TargetType.Email) {
        this.mailService.sendMessage(target.contact, message);
      } else if (target.type === TargetType.SMS) {
        this.smsService.sendMessage(target.contact, message);
      } else {
        throw new Error('Invalid target type!');
      }
    }
    console.log(`Notified targets of level ${escalationLevel.number}`);
  }
}