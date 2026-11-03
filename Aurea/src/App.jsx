import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { BudgetProvider } from './BudgetContext';
import Dashboard from './Dashboard';
import About from './About';
import styles from './Brand.module.css';
function Header() {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <Link to="/" className={styles.brand}>
        <span className={styles.mark}>A</span>
        <span>AUREA<small>THE ART OF SAVING</small></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link to="/">Overview</Link>
        <button className="quiet" onClick={() => navigate('/about')}>About ↗</button>
      </nav>
    </header>
  );
}
export function Panel({ title, eyebrow, children }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </>
      </div>
      {children}
    </section>
  );
}
export default function App() {
  return (
    <BudgetProvider>
      <div className="shell">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<About />} />
        </Routes>
        <footer>
          <span>✧ A little intention. A brighter tomorrow.</span>
          <span>YOUR MONEY. YOUR MOMENT.</span>
        </footer>
      </div>
    </BudgetProvider>
  );
}
