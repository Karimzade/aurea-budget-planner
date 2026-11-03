import { Panel } from './App';
import { calendarDays, dateKey, money } from './finance';
function Calendar({ month, selected, expenses, onSelect }) {
  return (
    <Panel eyebrow="THE BIG PICTURE" title="Your spending calendar">
      <div className="calendar-legend">
        <span><i /> Selected day</span>
        <span>Daily totals and expenses · EUR</span>
      </div>
      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span className="weekday" key={day}>{day}</span>)}
        {calendarDays(month).map((day, index) => {
          if (!day) return <div className="blank-day" key={`blank-${index}`} />;
          const items = expenses.filter((item) => item.date === day);
          const total = items.reduce((sum, item) => sum + item.amount, 0);
          return (
            <button key={day} aria-pressed={selected === day} aria-label={`${day}, ${money(total)} spent. ${items.map((item) => item.title + " " + money(item.amount)).join(", ")}`}
              className={`day ${selected === day ? 'selected' : ''} ${day === dateKey(new Date()) ? 'today' : ''}`}
              onClick={() => onSelect(day)}
            >
              <span>{Number(day.slice(-2))}</span>
              {total > 0 && <small>{money(total)}</small>}
              {items.map((item) => (
                <span className="calendar-expense" key={item.id}>{item.title}<small>{money(item.amount)}</small></span>
              ))}
            </button>
          );
        })}
      </div>
      <div className="calendar-note">
        <span>✧</span>
        <p>Small choices today.<br /><b>More possibilities tomorrow.</b></p>
      </div>
    </Panel>
  );
}
export default Calendar;
