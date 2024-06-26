export function convertToCustomISO(dateString: string) {
  return dateString.replace(/\.\d{3}Z$/, "+09:00");
}
