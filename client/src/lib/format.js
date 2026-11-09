const parseMonth = (month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1, 1);
};

export const todayInputValue = () => new Date().toLocaleDateString('en-CA');

export const currentMonth = () => todayInputValue().slice(0, 7);

export const shiftMonth = (month, offset) => {
  const date = parseMonth(month);
  date.setMonth(date.getMonth() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const formatMonth = (month) =>
  parseMonth(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export const formatShortMonth = (month) => parseMonth(month).toLocaleDateString('en-US', { month: 'short' });

export const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const toDateInputValue = (isoDate) => isoDate.slice(0, 10);

export const formatMoney = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const formatCompactMoney = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(
    amount
  );

export const formatPercent = (value) =>
  new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 }).format(value);
