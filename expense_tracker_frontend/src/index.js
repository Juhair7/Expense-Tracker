import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>,
  document.getElementById('root')
);
