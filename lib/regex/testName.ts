const regex = /^[A-Za-z가-힣]+$/;

export function testName(name: string) {
  return regex.test(name);
}
