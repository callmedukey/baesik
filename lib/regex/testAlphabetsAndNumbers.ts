export default function testAlphabetsAndNumbers(input: string) {
  const regex = /^[a-zA-Z0-9]{4,14}$/;
  return regex.test(input);
}
