import { useState, useEffect } from "react";
import type { ValidationRules } from "../types/common";

/**
 * Generic form data map.
 * Keys are field names. Values may be any serializable form value.
 */
type FormData = { [key: string]: any };

/**
 * Partial map of field names to error messages.
 * Only fields with validation errors appear as properties.
 */
type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Custom React hook for synchronous form validation.
 *
 * @template T - shape of the form data object.
 * @param formData - current form values keyed by field name.
 * @param schema - validation rules for a subset or all fields in formData.
 * @returns An object containing:
 *  - errors: map of field -> error message for fields that failed validation.
 *  - isFormValid: boolean indicating whether the form has zero validation errors.
 */
export const useValidation = <T extends FormData>(
  formData: T,
  schema: Partial<Record<keyof T, ValidationRules>>
) => {
  const [errors, setErrors] = useState<Errors<T>>({});

  useEffect(() => {
    const newErrors: Errors<T> = {};

    // Validate each field declared in the schema.
    for (const key in schema) {
      if (!Object.prototype.hasOwnProperty.call(schema, key)) {
        continue;
      }

      const rules = schema[key];
      const value = formData[key];

      // Required field check.
      if (rules?.required && (value === "" || value === null || value === undefined)) {
        newErrors[key] = "This field is required.";
        continue;
      }

      // String length checks.
      if (rules?.minLength && typeof value === "string" && value.length < rules.minLength) {
        newErrors[key] = `Must be at least ${rules.minLength} characters.`;
        continue;
      }
      if (rules?.maxLength && typeof value === "string" && value.length > rules.maxLength) {
        newErrors[key] = `Cannot exceed ${rules.maxLength} characters.`;
        continue;
      }

      // Numeric validation and numeric bounds checks.
      if (rules?.isNumeric) {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
          newErrors[key] = "Must be a number.";
          continue;
        }
        if (rules?.min !== undefined && numericValue < rules.min) {
          newErrors[key] = `Must be at least ${rules.min}.`;
          continue;
        }
        if (rules?.max !== undefined && numericValue > rules.max) {
          newErrors[key] = `Cannot exceed ${rules.max}.`;
          continue;
        }
      }
    }

    setErrors(newErrors);
  }, [formData, schema]);

  return { errors, isFormValid: Object.keys(errors).length === 0 };
};
