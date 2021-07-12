export interface PagerRepositoryPort {
  //Return last incident for the service
  getLast(serviceId: number): Promise<Dysfunction | null>;

  //Create an incident
  create(entry: Dysfunction): Promise<boolean>;

  //Update an inciden
  update(entry: Dysfunction): Promise<void>;
}

export type Dysfunction = {
  serviceId: number;
  isHealthy: boolean;
  escalationLevel: number;
  message: string;
  accepted: boolean;
}