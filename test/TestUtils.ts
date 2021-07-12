import { PagerService } from '../src/PagerService';
import { EscalationPolicyService } from './adapters/EscalationPolicyService';
import { MailService } from './adapters/MailService';
import { SMSService } from './adapters/SMSService';
import { TimerService } from './adapters/TimerService';
import { PagerRepository } from './adapters/PagerRepository';

export default class TestUtils {
  static createPagerService(): PagerService {
    return new PagerService(
      new EscalationPolicyService(),
      new MailService(),
      new SMSService(),
      new TimerService(),
      new PagerRepository()
    );
  }
}
