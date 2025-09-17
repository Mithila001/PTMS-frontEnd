export type FormUiType = "AddNew" | "EditExisting";

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  isNumeric?: boolean;
}

export type BaseResponse<T> = {
  status: number;
  message: string;
  data: T;
  errors: string[] | null;
  timestamp: string;
};
