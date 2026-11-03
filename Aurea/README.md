# Aurea — Monthly Budget Planner

An English, white-and-gold React course project with three core interactive features. No backend, account, external API, UI framework, or additional React state library is used.

## Run the ready-built application

1. Extract the ZIP completely.
2. Install Node.js LTS if it is not already installed.
3. On Windows, double-click `START-WINDOWS.bat`.
4. When the ready message appears, open **http://localhost:4181**.
5. Keep the terminal window open while using the application.

Alternatively run `node scripts/serve.mjs` from the project directory. The supplied `dist/` is already built; no package installation is needed for this route. Do not double-click `dist/index.html`: JavaScript modules, routing and offline installation require an HTTP server.

## Develop and rebuild

```sh
npm ci
npm run dev
```

```sh
npm test
node scripts/count-react.mjs
npm run build
npm run preview
```

`npm run build` bundles the application and then includes its generated assets in a versioned offline cache. Only enable and evaluate offline installation using the production build, not the development server.

## Exactly three core features

1. **Monthly budget management:** set or edit an independent budget for each month; view budget, spending, remaining amount and percentage used. At **80% or higher**, the indicator becomes red. Above 100%, remaining money becomes negative; the text reports the real percentage while the bar stops at 100% width.
2. **Expense management:** add, edit and delete an expense with title, amount, date and category. Valid positive amounts have at most two decimal places and are capped at EUR 1,000,000 per entry. All financial amounts are stored as integer cents.
3. **Interactive monthly calendar and review:** previous/next month, correct weekday alignment and leap years, selected-day details, daily totals and an independent monthly summary. Prior months display their unspent budget or overspending. A positive budget balance is not proof of actual bank savings.

The About page supports navigation and explains the application; it is not counted as a fourth core financial feature. Search and category filtering are not required or added.

## Files to explain in the presentation

There are **390 physical lines across all seven `.jsx` files**, including imports and blank lines. `node scripts/count-react.mjs` checks this limit. There is no React code hidden in another JavaScript file. Ordinary JavaScript expressions and event handlers inside JSX are necessary to use React.

| File | Responsibility |
| --- | --- |
| `src/main.jsx` | `createRoot`, rendering, `StrictMode`, `BrowserRouter` |
| `src/App.jsx` | shell, navigation, routes, reusable Panel, `children`, fragment |
| `src/BudgetContext.jsx` | shared state using `useReducer`, Provider, `useContext`, persistence effect |
| `src/Dashboard.jsx` | current month and selection, budget form, cards, progress, `useMemo`, `useCallback` |
| `src/Calendar.jsx` | props, lists, stable keys, conditional rendering, day selection |
| `src/Expenses.jsx` | controlled form, state, events, expense list, editing and deletion |
| `src/About.jsx` | function component plus a small class component extending Component with `render()` |

The six taught hooks (`useState`, `useReducer`, `useContext`, `useEffect`, `useMemo`, `useCallback`) are present. The tiny `useBudget` helper simply calls `useContext`. No `useRef`, effects library, Suspense, server components or advanced React APIs are used. `useCallback` demonstrates retaining a callback reference; it does **not** by itself prevent Calendar from rendering. `useMemo` demonstrates cached monthly calculation; it is not needed for correctness.

The data flow is: form event → dispatch action → pure reducer returns a new state → React renders updated views → effect saves state locally. Array updates are immutable using spread syntax and filter.

## Files outside the React presentation

- `src/finance.js`: pure JavaScript dates, validation, formatting, calculations and the reducer. A reducer is a plain function passed to the React hook; it is deliberately separated here. Know its action types for questions.
- `src/storage.js`: browser storage and service-worker registration.
- `src/bootstrap.js`: startup glue; no React implementation.
- `src/styles.css`, `src/layout.css`: visual design and responsive breakpoints.
- `src/Brand.module.css`: locally scoped brand styling. The progress width also demonstrates React inline styling.
- `public/`: manifest, app icons, service worker and static-host routing fallback.
- `scripts/`: Node build, local server and source-count utilities.
- `tests/`: meaningful financial/calendar checks, not part of the React line count.

JavaScript foundations from the lessons (functions, arrow functions, const/let, destructuring, map/filter/reduce and spread) underpin the implementation. The project does not artificially use `var` or reproduce each lecture exercise. Installation, DOM versus React, Vite, npm and Developer Tools are setup/concept topics, not extra product features. React, React DOM and React Router are the only runtime dependencies.

## iPhone installation and offline use

The package is **PWA-ready**, not an App Store binary. It has not been installed or tested on your physical iPhone in this session.

1. Publish the **contents of `dist/`** at the root of an HTTPS static website. Do not upload `node_modules/`. Hosting must return `index.html` for SPA navigation such as `/about`; `_redirects` is provided for compatible hosts. On other hosts configure the equivalent fallback.
2. Open that HTTPS address in iPhone Safari.
3. Choose **Share → Add to Home Screen**; enable **Open as Web App** if offered, then Add.
4. Launch the Home Screen app online once. Allow its initial cache installation to complete, then verify in airplane mode that it opens and records expenses.

`localhost` on a phone means the phone itself. A laptop's ordinary LAN HTTP URL is suitable for basic visual checks but not a substitute for HTTPS PWA deployment. The ZIP by itself does not install an app on iPhone. This delivery does not include a published HTTPS URL.

## Data and privacy

Data is stored under `aurea-budget-v1` in localStorage for the current browser origin. It is not uploaded anywhere and is not synchronized across devices, different URLs, or browser installations. Treat Home Screen app storage as separate until verified on your iOS version. Website-data removal, private browsing, storage eviction or changing the hosting address can remove or hide records. There is no backup/export feature in this minimal course scope. A visible warning appears when saving fails. All timestamps in the calendar use local dates; the currency is EUR and the interface is English.

New installations start empty. Screenshots use manually entered illustrative expenses, not preloaded financial records.

## Validation and course presentation

Automated checks cover exact currency conversion, invalid amounts, leap years, Monday-first weekday layout, year transitions, immutable reducer updates, 80% usage, negative remaining balance, monthly isolation, editing and deletion. The production build is verified. Desktop browser interaction checks cover budget entry, adding/editing/deleting expenses, 80% warning, 105% overspending, persistence after reload, month navigation and the About route. Responsive layout was inspected at a 390px browser viewport without horizontal overflow. Physical iPhone installation and airplane-mode operation remain device-side checks.

For React Developer Tools: open Components, inspect `Dashboard`, `Calendar` and `Expenses`, inspect Props and state, and optionally record an interaction in Profiler. In development, StrictMode can invoke initializers/reducers and effect setup more than once; these functions must remain pure and persistence is idempotent.

See `PRESENTATION-FA.md` for a Persian explanation and a ten-minute demo outline. Confirm the topic with the lecturer, understand and adapt the source yourself, and follow the course's rules about independent work and assistance. The technical files cannot substitute for your own explanation in the question round.
