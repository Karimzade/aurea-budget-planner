import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDays, centsFrom, moveMonth, monthKey, reducer, summarize } from '../src/finance.js';
test('currency is precise and rejects invalid expenses', () => {
  assert.equal(centsFrom('0.29'), 29); assert.equal(centsFrom('1000.50'), 100050);
  for (const value of ['0', '-1', '1.001', 'abc', '', '1000001', 'Infinity']) assert.equal(centsFrom(value), null);
});
test('calendar respects leap years, weekday alignment and year boundaries', () => {
  const days = calendarDays(new Date(2024, 1, 1));
  assert.equal(days.filter(Boolean).length, 29); assert.equal(days.indexOf('2024-02-01'), 3);
  assert.equal(calendarDays(new Date(2025, 1, 1)).filter(Boolean).length, 28);
  assert.equal(monthKey(moveMonth(new Date(2026, 11, 31), 1)), '2027-01');
});
test('monthly isolation, 80% warning, overspending and immutable updates', () => {
  const initial = { budgets: {}, expenses: [] };
  const budgeted = reducer(initial, { type: 'budget', month: '2026-11', amount: 10000 });
  const first = reducer(budgeted, { type: 'save', item: { id: 'a', date: '2026-11-02', amount: 8000 } });
  assert.equal(summarize(first, '2026-11').percent, 80); assert.equal(initial.budgets['2026-11'], undefined);
  const updated = reducer(first, { type: 'save', item: { id: 'a', date: '2026-11-02', amount: 11000 } });
  assert.equal(updated.expenses.length, 1); assert.equal(summarize(updated, '2026-11').remaining, -1000);
  assert.equal(summarize(updated, '2026-12').total, 0); assert.equal(first.expenses[0].amount, 8000);
  const deleted = reducer(updated, { type: 'delete', id: 'a' }); assert.equal(summarize(deleted, '2026-11').total, 0);
});
