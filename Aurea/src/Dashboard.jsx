import { useCallback, useMemo, useState } from 'react';
import { useBudget } from './BudgetContext';
import { centsFrom, dateKey, monthKey, monthName, money, moveMonth, summarize } from './finance';
import Calendar from './Calendar';
import Expenses from './Expenses';

export default function Dashboard() {
  const { state, dispatch } = useBudget();
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(() => dateKey(new Date()));
  const [editing, setEditing] = useState(null);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const key = monthKey(month);
  const summary = useMemo(() => summarize(state, key), [state, key]);
  const selectDay = useCallback((day) => {
    setSelected(day);
    setEditing(null);
  }, []);
  const warning = summary.budget > 0 && summary.percent >= 80;
  const past = key < monthKey(new Date());
  function changeMonth(offset) {
    const next = moveMonth(month, offset);
    setMonth(next);
    selectDay(dateKey(next));
    setBudgetOpen(false);
  }
  function saveBudget(event) {
    event.preventDefault();
    const amount = centsFrom(input);
    if (amount === null) {
      setError('Enter a budget between €0.01 and €1,000,000 (up to 2 decimal places).');
      return;
    }
    dispatch({ type: 'budget', month: key, amount });
    setBudgetOpen(false);
    setError('');
  }
  return (
    <main>
      <div className="intro">
        <div>
          <p className="eyebrow">YOUR MONTH, BEAUTIFULLY BALANCED</p>
          <h1>Make room for <em>tomorrow.</em></h1>
          <p className="subtitle">Spend with intention. Let your savings shine.</p>
        </div>
        <span className="private-badge">◈ Private & on your device</span>
      </div>
      <div className="monthbar">
        <div className="month-switch">
          <button aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
          <h2>{monthName(month)}</h2>
          <button aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
        </div>
        <button
          className="gold-button"
          onClick={() => {
            setInput(summary.budget ? String(summary.budget / 100) : '');
            setError('');
            setBudgetOpen(!budgetOpen);
          }}
        >
          {summary.budget ? 'Edit monthly budget' : 'Set monthly budget'} <span>↗</span>
        </button>
      </div>
      {budgetOpen && (
        <form className="budget-form" onSubmit={saveBudget}>
          <label>
            Monthly budget (€)
            <input type="number" min="0.01" max="1000000" step="0.01" required value={input} onChange={(event) => setInput(event.target.value)} autoFocus />
          </label>
          <button className="gold-button">Save budget</button>
          <button type="button" className="quiet" onClick={() => setBudgetOpen(false)}>Cancel</button>
          {error && <p role="alert">{error}</p>}
        </form>
      )}
      <section className="summary-grid" aria-label="Monthly summary">
        <article className="stat">
          <p className="eyebrow">MONTHLY BUDGET <span>◇</span></p>
          <strong>{money(summary.budget)}</strong>
          <p>Your plan for the month</p>
        </article>
        <article className="stat">
          <p className="eyebrow">TOTAL SPENT <span>↗</span></p>
          <strong>{money(summary.total)}</strong>
          <p>{summary.expenses.length} recorded transaction{summary.expenses.length !== 1 ? 's' : ''}</p>
        </article>
        <article className={`stat remaining ${summary.remaining < 0 ? 'over' : ''}`}>
          <p className="eyebrow">{past ? 'MONTH-END BALANCE' : 'REMAINING'} <span>✧</span></p>
          <strong>{summary.budget ? money(summary.remaining) : '—'}</strong>
          <p>
            {!summary.budget
              ? 'Set a budget to see your balance'
              : summary.remaining < 0
                ? 'Above your planned budget'
                : past
                  ? 'Unspent from your monthly budget'
                  : 'Still available this month'}
          </p>
        </article>
      </section>
      <section className={`progress-panel ${warning ? 'warning' : ''}`} aria-label="Budget consumption">
        <div>
          <span>
            {!summary.budget
              ? 'Your next chapter starts with a budget'
              : summary.percent > 100
                ? `Over budget by ${money(-summary.remaining)}`
                : warning
                  ? 'A little pause goes a long way'
                  : 'A thoughtful pace. A brighter future.'}
          </span>
          <b>{summary.budget ? `${summary.percent.toFixed(1)}% used` : 'No budget set'}</b>
        </div>
        <div className="track" role="progressbar" aria-label="Budget used" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={Math.min(100, summary.percent)} aria-valuetext={`${summary.percent.toFixed(1)} percent spent`}>
          <span style={{ width: `${Math.min(100, summary.percent)}%` }} />
        </div>
        <p role={warning ? 'status' : undefined}>
          {!summary.budget
            ? 'Choose your monthly limit, then record your everyday spending.'
            : warning
              ? `You have used ${summary.percent.toFixed(1)}% of your monthly budget. ${summary.remaining >= 0 ? `${money(summary.remaining)} remains.` : 'Review your spending before your next purchase.'}`
              : 'Every mindful choice makes a difference.'}
        </p>
      </section>
      <div className="workspace">
        <Calendar month={month} selected={selected} expenses={summary.expenses} onSelect={selectDay} />
        <Expenses selected={selected} editing={editing} setEditing={setEditing} />
      </div>
    </main>
  );
}
