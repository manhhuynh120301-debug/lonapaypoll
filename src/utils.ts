
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + ' đ';
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};
