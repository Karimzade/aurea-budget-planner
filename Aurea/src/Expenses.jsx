import { useState } from 'react';
import { Panel } from './App';
import { useBudget } from './BudgetContext';
import { categories, centsFrom, longDate, money } from './finance';

function ExpenseForm({ selected, editing, onDone }) {
  const { dispatch } = useBudget();
  const [title, setTitle] = useState(editing?.title || '');
  const [amount, setAmount] = useState(editing ? String(editing.amount / 100) : '');
  const [date, setDate] = useState(editing?.date || selected);
  const [category, setCategory] = useState(editing?.category || 'Food');
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    const cents = centsFrom(amount);
    if (!title.trim() || cents === null || !date) {
      setError('Add a title, valid date and amount from €0.01 to €1,000,000 (up to 2 decimals).');
      return;
    }
    dispatch({ type: 'save', item: { id: editing?.id || crypto.randomUUID(), title: title.trim(), amount: cents, date, category } });
    setTitle('');
    setAmount('');
    setError('');
    onDone();
  }
  return (
    <form className="expense-form" onSubmit={submit}>
      <label>
        What was it for?
        <input required maxLength={80} placeholder="e.g. Coffee with a friend" value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <div className="form-row">
        <label>
          Amount (€)
          <input required type="number" min="0.01" max="1000000" step="0.01" placeholder="0.00"
            value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label>
          Date
          <input required type="date" min="1900-01-01" max="9999-12-31" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>
      <label>
        Category
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      {error && <p role="alert" className="error">{error}</p>}
      <button className="gold-button full">{editing ? 'Save changes' : '+ Add expense'}</button>
      {editing && <button type="button" className="quiet full" onClick={onDone}>Cancel editing</button>}
    </form>
  );
}
export default function Expenses({ selected, editing, setEditing }) {
  const { state, dispatch } = useBudget();
  const items = state.expenses.filter((item) => item.date === selected);
  return (
    <aside>
      <Panel eyebrow="A MOMENT OF INTENTION" title={editing ? 'Edit your expense' : 'Record an expense'}>
        <ExpenseForm key={`${selected}-${editing?.id || 'new'}`} selected={selected} editing={editing} onDone={() => setEditing(null)} />
      </Panel>
      <Panel eyebrow={longDate(selected)} title="The day's details">
        <div aria-live="polite">
          {items.length === 0 ? (
            <div className="empty">
              <span>◇</span>
              <p>A fresh page.</p>
              <small>No expenses recorded for this day.</small>
            </div>
          ) : (
            <ul className="expense-list">
              {items.map((item) => (
                <li key={item.id}>
                  <span className="category-icon">{item.category.slice(0, 1)}</span>
                  <div>
                    <b>{item.title}</b>
                    <small>{item.category}</small>
                    <div className="item-actions">
                      <button onClick={() => setEditing(item)}>Edit</button>
                      <button
                        onClick={() => {
                          dispatch({ type: 'delete', id: item.id });
                          if (editing?.id === item.id) setEditing(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <strong>{money(item.amount)}</strong>
                </li>
              ))}
            </ul>
          )}
          <div className="day-total">
            <span>Daily total</span>
            <b>{money(items.reduce((sum, item) => sum + item.amount, 0))}</b>
          </div>
        </div>
      </Panel>
    </aside>
  );
}
