export const formatPhoneInput = (value: string, oldValue: string = "") => {
  // 1. If the input is exactly "+", auto-fill to "+62"
  if (value === "+") {
    return "+62";
  }

  // 2. Extract only digits for processing
  const digits = value.replace(/\D/g, "");

  // 3. Handle Deletion:
  // If the user is deleting and only "+62" or "+" remains, clear the input
  const isDeleting = value.length < oldValue.length;
  if (isDeleting && (value === "+62" || value === "+")) {
    return "";
  }

  // 4. If empty (and not caught by deletion logic), return empty
  if (!digits) {
    return "";
  }

  // 5. Force the "+62" prefix logic
  let result = digits;
  if (digits.startsWith("0")) {
    // Convert 08... to 628...
    result = "62" + digits.slice(1);
  } else if (!digits.startsWith("62")) {
    // If user starts with '8...', prepend '62'
    result = "62" + digits;
  }

  // 6. Final format: ensure it always starts with +62 and remove extra 0 after 62
  if (result.startsWith("620")) {
    result = "62" + result.slice(3);
  }

  // Limit to 14 digits (standard IDN phone length)
  return `+${result.slice(0, 14)}`;
};
