import { useState, useEffect } from "react";
import type { ValidationRules } from "../types/common";

type FormData = { [key: string]: any };
type Errors<T> = Partial<Record<keyof T, string>>;

export const useValidation = <T extends FormData>(
  formData: T,
  schema: Partial<Record<keyof T, ValidationRules>>
) => {
  const [errors, setErrors] = useState<Errors<T>>({});

  useEffect(() => {
    const newErrors: Errors<T> = {};

    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const rules = schema[key];
        const value = formData[key];

        // Rule 1: Check for required fields
        if (rules?.required && (value === "" || value === null || value === undefined)) {
          newErrors[key] = "This field is required.";
          continue; // Move to the next field if a required field is empty
        }

        // Rule 2: Check min/max length for strings
        if (rules?.minLength && typeof value === "string" && value.length < rules.minLength) {
          newErrors[key] = `Must be at least ${rules.minLength} characters.`;
        }
        if (rules?.maxLength && typeof value === "string" && value.length > rules.maxLength) {
          newErrors[key] = `Cannot exceed ${rules.maxLength} characters.`;
        }

        // Rule 3: Check min/max for numbers
        if (rules?.isNumeric) {
          const numericValue = Number(value);
          if (isNaN(numericValue)) {
            newErrors[key] = "Must be a number.";
          } else if (rules?.min && numericValue < rules.min) {
            newErrors[key] = `Must be at least ${rules.min}.`;
          } else if (rules?.max && numericValue > rules.max) {
            newErrors[key] = `Cannot exceed ${rules.max}.`;
          }
        }
      }
    }
    setErrors(newErrors);
  }, [formData, schema]);

  return { errors, isFormValid: Object.keys(errors).length === 0 };
};
