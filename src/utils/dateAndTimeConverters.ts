export const formatSpringBootLocalTime = (date: Date | null): string | null => {
  if (!date) {
    return null;
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const parseSpringBootLocalTime = (timeString: string | null): Date | null => {
  if (!timeString) {
    return null;
  }
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
};

export const formatSpringBootDate = () => {};

export const parseSpringBootLocalDate = () => {};
