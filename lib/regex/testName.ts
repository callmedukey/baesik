const regex = /^[A-Za-z0-9가-힣\s]+$/;

export function testName(name: string) {
  return regex.test(name);
}
