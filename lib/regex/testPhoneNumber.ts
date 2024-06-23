export default function testValidPhoneNumber(phoneNumber: string) {
  const regex = /^[0-9-]{11,14}$/;
  return regex.test(phoneNumber);
}
