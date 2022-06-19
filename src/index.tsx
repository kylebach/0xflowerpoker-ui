import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './comp/App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
);

reportWebVitals();
