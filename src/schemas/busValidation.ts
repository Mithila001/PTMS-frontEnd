import type { ValidationRules } from "../types/common";

// A type to define the validation schema for the entire Bus object
export interface BusValidationSchema {
  registrationNumber: ValidationRules;
  make: ValidationRules;
  model: ValidationRules;
  yearOfManufacture: ValidationRules;
  fuelType: ValidationRules;
  serviceType: ValidationRules;
  comfortType: ValidationRules;
  seatingCapacity: ValidationRules;
  standingCapacity: ValidationRules;
  ntcPermitNumber: ValidationRules;
}

// The actual validation schema for the Bus registration form
export const busValidationSchema: BusValidationSchema = {
  registrationNumber: { required: true, minLength: 5, maxLength: 15 },
  make: { required: true, minLength: 2 },
  model: { required: true, minLength: 2 },
  yearOfManufacture: {
    required: true,
    isNumeric: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  },
  fuelType: { required: true },
  serviceType: { required: true },
  comfortType: { required: true },
  seatingCapacity: { required: true, isNumeric: true, min: 1 },
  standingCapacity: { required: true, isNumeric: true, min: 0 },
  ntcPermitNumber: { required: true, isNumeric: true, minLength: 5 },
};

// You can add more complex rules here as needed, like regex for registrationNumber
// or custom validation functions.
