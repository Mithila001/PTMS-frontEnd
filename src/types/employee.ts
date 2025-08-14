// Add these new types to the existing common.ts file

export interface Employee {
  id: number;
  nicNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601 string
  contactNumber: string;
  email: string;
  address: string;
  dateJoined: string; // ISO 8601 string
  isCurrentEmployee: boolean;
  available: boolean;
}

export interface Conductor extends Employee {
  conductorLicenseNumber: string;
  licenseExpirationDate: string; // ISO 8601 string
}

export interface Driver extends Employee {
  drivingLicenseNumber: string;
  licenseExpirationDate: string; // ISO 8601 string
  licenseClass: string;
  ntcLicenseNumber: string;
  ntcLicenseExpirationDate: string; // ISO 8601 string
}
