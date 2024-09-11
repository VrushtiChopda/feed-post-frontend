import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux-toolkit/Store';
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap JS bundle (includes Popper.js)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// jQuery (optional, but needed for some Bootstrap components like modals if you are using Bootstrap JS)
import 'jquery/dist/jquery.min.js';
// Font Awesome
import 'font-awesome/css/font-awesome.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);