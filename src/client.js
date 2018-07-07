import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import 'moment/locale/ru';
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
      <LocaleProvider locale={ru_RU}>
        <App />
      </LocaleProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
