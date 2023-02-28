// toISOString(): ISO 형식(YYYY-MM-DDTHH)의 문자열 반환
export const getStringDate = (date) => {
  return date.toISOString().slice(0, 10);
};
