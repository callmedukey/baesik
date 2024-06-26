export function formatDateToISO8601WithOffset(date: Date) {
  // Helper function to pad single digit numbers with leading zero
  function pad(number: number) {
    return number < 10 ? "0" + number : number;
  }

  // Adjust the date to the desired timezone offset (+09:00)
  const offsetInHours = 9;
  const offsetInMilliseconds = offsetInHours * 60 * 60 * 1000;
  const localDate = new Date(date.getTime() + offsetInMilliseconds);

  // Extract the components of the adjusted date
  const year = localDate.getFullYear();
  const month = pad(localDate.getMonth() + 1); // Months are zero-indexed
  const day = pad(localDate.getDate());
  const hours = pad(localDate.getHours());
  const minutes = pad(localDate.getMinutes());
  const seconds = pad(localDate.getSeconds());

  // Combine the components into the desired format
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;

  return formattedDate;
}
