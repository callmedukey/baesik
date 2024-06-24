export function formatDateString(dateString: string): string {
  if (dateString.length !== 8) {
    throw new Error("Input string must be 8 characters long");
  }

  // Insert dashes at the 5th and 8th positions
  let formattedDate =
    dateString.slice(0, 4) +
    "-" +
    dateString.slice(4, 6) +
    "-" +
    dateString.slice(6, 8);
  return formattedDate;
}
