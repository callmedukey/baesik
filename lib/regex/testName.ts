const regex = /^[\p{L}]+$/u;

export function testName(name: string) {
  return regex.test(name);
}
