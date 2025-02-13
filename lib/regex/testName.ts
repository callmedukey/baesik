const regex = /^[A-Za-z0-9가-힣\s]+$/;
const koreanNameRegex = /^[가-힣]{1,4}$/;

export function testName(name: string) {
  return regex.test(name);
}

export function testKoreanName(name: string) {
  return koreanNameRegex.test(name);
}
