import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { reducer } from './finance';
import { load, persist } from './storage';
const BudgetContext = createContext(null);
export const useBudget = () => useContext(BudgetContext);
export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    setStorageError(!persist(state));
  }, [state]);
  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {storageError && <p role="alert" className="notice">Storage is unavailable. Changes may not survive a reload.</p>}
      {children}
    </BudgetContext.Provider>
  );
}
