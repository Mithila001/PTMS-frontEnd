import type { ValidationRules } from "../types/common";
import { employeeValidationSchema } from "./employeeValidation";

// Validation schema specific to Driver
export interface DriverValidationSchema {
  drivingLicenseNumber: ValidationRules;
  licenseExpirationDate: ValidationRules;
  licenseClass: ValidationRules;
  ntcLicenseNumber: ValidationRules;
  ntcLicenseExpirationDate: ValidationRules;
}

export const driverValidationSchema: DriverValidationSchema = {
  ...employeeValidationSchema,
  drivingLicenseNumber: { required: true, minLength: 5 },
  licenseExpirationDate: { required: true },
  licenseClass: { required: true, minLength: 1 },
  ntcLicenseNumber: { required: true, minLength: 5 },
  ntcLicenseExpirationDate: { required: true },
};
