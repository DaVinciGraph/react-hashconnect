import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast'
import reportWebVitals from './reportWebVitals';
import HashConnectProvider from '../src/contexts/hashconnect'
import SingingProvider from '../src/contexts/signing'
import App from './App';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<>
  <Toaster></Toaster>
  <SingingProvider>
    <HashConnectProvider>
      <App />
    </HashConnectProvider>
  </SingingProvider>
</>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
