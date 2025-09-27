// A type to define the validation schema for the base Employee object
export const employeeValidationSchema = {
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  nicNumber: { required: true, minLength: 10, maxLength: 12 },
  dateOfBirth: { required: true },
  contactNumber: { required: true, minLength: 10, maxLength: 10 },
  email: { required: true },
  address: { required: true, minLength: 5 },
  dateJoined: { required: true },
};
