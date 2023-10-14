import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ContextProvider } from './my-context';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);