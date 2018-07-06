import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import AppStore from './stores/AppStore';
import config from '../config';

const app = new AppStore({
  user: JSON.parse(document.body.dataset.user),
  config,
});

hydrate(
  <BrowserRouter>
    <Provider app={app}>
        <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
