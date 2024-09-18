export default function testBankAccountNumber(accountNumber: string) {
  const regex = /^[0-9\-]+$/;
  return regex.test(accountNumber);
}
  