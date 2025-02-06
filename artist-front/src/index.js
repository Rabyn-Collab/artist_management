import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';

import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={store}>
    <App />

    <ToastContainer
      position='top-right'
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      autoClose={1000}
    />

  </Provider>


);

