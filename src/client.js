import App from './components/App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';
import AppStore from './stores/AppStore';

const app = new AppStore({
  user: JSON.parse(document.body.dataset.user),
});

hydrate(
  <Provider app={app}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
