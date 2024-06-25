export async function testBankDetails(bankDetails: string): Promise<boolean> {
  const regex = /^[a-zA-Z0-9\s\-\uAC00-\uD7A3]+$/;
  return regex.test(bankDetails);
}
