type ChangeLog = {
  key: string;
  oldValue: unknown;
  newValue: unknown;
};

type ComparisonResult = {
  isMatching: boolean;
  isError: boolean;
  changedLogs: ChangeLog[];
  errorMessage: string;
};

/**
 * Performs a shallow comparison of two objects to detect changes in primitive values.
 * It returns a structured result including a boolean indicating if the objects match,
 * an array of changed properties, and error information.
 *
 * @template T The type of the objects being compared.
 * @param {T} obj1 The first object for comparison.
 * @param {T} obj2 The second object for comparison.
 * @returns {ComparisonResult} The result of the comparison, including logs of changes.
 */
export const compareTwoObjects = <T extends object>(obj1: T, obj2: T): ComparisonResult => {
  const result: ComparisonResult = {
    isMatching: true,
    isError: false,
    changedLogs: [],
    errorMessage: "",
  };

  /**
   * Helper function to check if an object contains non-primitive values.
   * This is used to enforce a shallow comparison and prevent errors with nested objects.
   * @param {T} obj The object to check.
   * @returns {boolean} True if the object contains a non-primitive value, otherwise false.
   */
  const hasNonPrimitive = (obj: T): boolean => {
    return Object.values(obj).some((value) => typeof value === "object" && value !== null);
  };

  // Guard against objects with non-primitive values, as this function only supports shallow comparisons.
  if (hasNonPrimitive(obj1) || hasNonPrimitive(obj2)) {
    result.isMatching = false;
    result.isError = true;
    result.errorMessage =
      'Objects contain non-primitive values (nested objects or arrays). The "compareTwoObjects" function only supports a shallow comparison of primitive types.';
    return result;
  }

  // Ensure the objects have the same number of properties before proceeding.
  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) {
    result.isMatching = false;
    result.errorMessage = "Objects have a different number of properties.";
    return result;
  }

  // Iterate over each key to find and log any value differences.
  for (const key of keys1) {
    const value1 = obj1[key] as unknown;
    const value2 = obj2[key] as unknown;

    if (value1 !== value2) {
      result.isMatching = false;
      result.changedLogs.push({
        key: String(key),
        oldValue: value1,
        newValue: value2,
      });
    }
  }

  return result;
};
