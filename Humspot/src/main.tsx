/**
 * @file main.tsx
 * @fileoverview does the hydration on the root element of the index.html page
 */

import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';

import { ContextProvider } from './utils/my-context';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);