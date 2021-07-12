import { EscalationPolicyServicePort, EscalationPolicy, TargetType } from '../../src/ports/EscalationPolicyServicePort';

export class EscalationPolicyService implements EscalationPolicyServicePort {
  getEscalationPolicy(serviceId: number): Promise<EscalationPolicy> {
    switch (serviceId) {
      case 1:
      case 3:
      case 4:
      case 5:
        return Promise.resolve(
          {
            levels: [
              {
                number: 1,
                targets: [
                  {
                    type: TargetType.SMS,
                    contact: '611111111',
                  },
                  {
                    type: TargetType.Email,
                    contact: 'target1@email.es',
                  }
                ]
              }
            ]
          }
        );
      case 2:
        return Promise.resolve(
          {
            levels: []
          }
        );
      case 6:
      case 7:
        return Promise.resolve(
          {
            levels: [
              {
                number: 1,
                targets: [
                  {
                    type: TargetType.SMS,
                    contact: '622222222',
                  },
                  {
                    type: TargetType.Email,
                    contact: 'target2@email.es',
                  }
                ]
              },
              {
                number: 2,
                targets: [
                  {
                    type: TargetType.SMS,
                    contact: '633333333',
                  },
                  {
                    type: TargetType.Email,
                    contact: 'target3@email.es',
                  }
                ]
              }
            ]
          }
        );
      default:
        throw new Error('serviceId invalid!');
    }
  }
}
