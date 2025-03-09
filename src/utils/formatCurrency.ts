export const formatCurrency = (value: number | undefined) => {
  if (typeof value !== 'number' || isNaN(value)) return '0원';
  return value < 0
    ? `-${Math.abs(value).toLocaleString()}원`
    : `${value.toLocaleString()}원`;
};
