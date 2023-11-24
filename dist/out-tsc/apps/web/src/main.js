import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(_jsx(StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }));
//# sourceMappingURL=main.js.map