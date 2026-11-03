export const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Leisure', 'Other'];
export const money = cents => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
export const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const monthKey = date => dateKey(date).slice(0, 7);
export const monthName = date => date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
export const longDate = key => new Date(`${key}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
export function centsFrom(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(value))) return null;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 100000000 ? cents : null;
}
export function calendarDays(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const length = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return [...Array(offset).fill(null), ...Array.from({ length }, (_, i) => dateKey(new Date(date.getFullYear(), date.getMonth(), i + 1)))];
}
export const moveMonth = (date, offset) => new Date(date.getFullYear(), date.getMonth() + offset, 1);
export function summarize(state, month) {
  const expenses = state.expenses.filter(item => item.date.startsWith(month));
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const budget = state.budgets[month] || 0;
  return { expenses, total, budget, remaining: budget - total, percent: budget ? total / budget * 100 : 0 };
}
export function reducer(state, action) {
  switch (action.type) {
    case 'budget': return { ...state, budgets: { ...state.budgets, [action.month]: action.amount } };
    case 'save': return { ...state, expenses: [...state.expenses.filter(item => item.id !== action.item.id), action.item] };
    case 'delete': return { ...state, expenses: state.expenses.filter(item => item.id !== action.id) };
    default: return state;
  }
}
