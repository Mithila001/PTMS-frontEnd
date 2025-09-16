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

export type EmployeeType = "driver" | "conductor";

export type EmployeeSearchResult = {
  id: number;
  nicNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  address: string;
  dateJoined: string;
  currentEmployee: boolean;
};

export type DriverSearchResult = EmployeeSearchResult & {
  drivingLicenseNumber: string;
};

export type ConductorSearchResult = EmployeeSearchResult & {
  conductorLicenseNumber: string;
};

export interface PaginatedEmployeeResponse {
  content: EmployeeSearchResult[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
