export interface EscalationPolicyServicePort {
  getEscalationPolicy(serviceId: number): Promise<EscalationPolicy>;
}

//An Escalation Policy contains an ordered list of levels
export type EscalationPolicy = {
  levels: Array<Level>;
}

export type Level = {
  number: number;
  targets: Array<Target>;
}

export type Target = {
  type: TargetType;
  contact: string;
}

export enum TargetType {
  SMS,
  Email
}