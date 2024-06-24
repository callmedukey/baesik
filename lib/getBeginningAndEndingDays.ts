export default function getBeginningAndEndingDays(
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) {
  // JavaScript months are 0-based (0 = January, 11 = December)
  let beginningDay = new Date(year, month, 1);
  let endingDay = new Date(year, month + 1, 0);

  return {
    beginningDay: beginningDay,
    endingDay: endingDay,
  };
}
