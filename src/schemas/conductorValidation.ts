import type { ValidationRules } from "../types/common";
import { employeeValidationSchema } from "./employeeValidation";

// Validation schema specific to Conductor
export interface ConductorValidationSchema {
  conductorLicenseNumber: ValidationRules;
  licenseExpirationDate: ValidationRules;
}

export const conductorValidationSchema: ConductorValidationSchema = {
  ...employeeValidationSchema,
  conductorLicenseNumber: { required: true, minLength: 5 },
  licenseExpirationDate: { required: true },
};
