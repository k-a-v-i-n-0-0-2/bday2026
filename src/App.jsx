// App.jsx
import { Outlet, useLocation, useRouteError } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import FloatingHearts from './components/FloatingHearts/FloatingHearts';
import './App.css';

export function ErrorBoundary() {
  const error = useRouteError();
  console.error('Router Error:', error);
  
  return (
    <div className="error-boundary">
      <h2>Oops! Something went wrong</h2>
      <p>We couldn't load the page properly.</p>
      <pre style={{whiteSpace: 'pre-wrap'}}>{error.message}</pre>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
}

function App() {
  const location = useLocation();
  
  return (
    <div className="app">
      <FloatingHearts />
      <Header />
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}

export default App;