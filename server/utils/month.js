export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const currentMonth = () => new Date().toISOString().slice(0, 7);

export const resolveMonth = (value) => (MONTH_PATTERN.test(value ?? '') ? value : currentMonth());

export const monthRange = (month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  };
};

export const shiftMonth = (month, offset) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(Date.UTC(year, monthNumber - 1 + offset, 1)).toISOString().slice(0, 7);
};

export const roundMoney = (value) => Math.round(value * 100) / 100;
