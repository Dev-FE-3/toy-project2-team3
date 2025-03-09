export const formatCurrency = (value: number | undefined) => {
  if (typeof value !== 'number' || isNaN(value)) return '0₩';
  return value < 0
    ? `-${Math.abs(value).toLocaleString()}₩`
    : `${value.toLocaleString()}₩`;
};
