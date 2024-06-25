export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length !== 11) {
    throw new Error("Input string must be 11 characters long");
  }

  // Insert dashes at the specified positions
  let formattedPhoneNumber =
    phoneNumber.slice(0, 3) +
    "-" +
    phoneNumber.slice(3, 7) +
    "-" +
    phoneNumber.slice(7, 11);
  return formattedPhoneNumber;
}
