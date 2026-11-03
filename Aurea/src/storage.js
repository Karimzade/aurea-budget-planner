const key = 'aurea-budget-v1';
export function load() {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (!data || !data.budgets || !Array.isArray(data.expenses)) return { budgets: {}, expenses: [] };
    const validAmount = value => Number.isSafeInteger(value) && value > 0 && value <= 100000000;
    return {
      budgets: Object.fromEntries(Object.entries(data.budgets).filter(([month, amount]) => /^\d{4}-\d{2}$/.test(month) && validAmount(amount))),
      expenses: data.expenses.filter(item => item && typeof item.id === 'string' && typeof item.title === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && validAmount(item.amount) && typeof item.category === 'string')
    };
  } catch { return { budgets: {}, expenses: [] }; }
}
export function persist(state) {
  try { localStorage.setItem(key, JSON.stringify(state)); return true; }
  catch { return false; }
}
export function installOffline() {
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
