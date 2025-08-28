export interface Bus {
  id: number;
  registrationNumber: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  fuelType: string;
  seatingCapacity: number;
  standingCapacity: number;
  ntcPermitNumber: number;
  comfortType: string;
  serviceType: string;
  active: boolean;
  isA_C: boolean;
}
