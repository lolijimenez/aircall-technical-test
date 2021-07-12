export interface PagerServicePort {
  //Receive alert
  openIncident(serviceId: number, message: string): Promise<boolean>;

  //Alert Acknowledgement
  acceptIncident(serviceId: number): Promise<boolean>;

  //Healthy event
  closeIncident(serviceId: number): Promise<boolean>;

  //Acknowledgement Timeout
  refreshIncident(serviceId: number): Promise<boolean>;
}