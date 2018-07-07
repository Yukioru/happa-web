import React from 'react';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Home from '../Home';
import Auth from '../Auth';
import Sidebar from '../Sidebar';
import Schedule from '../Schedule';
import '../../styles/css/app.css';

const { Header, Content, Footer } = Layout;

const menuKeys = {
  home: 'Главная',
  schedule: 'Расписание',
  alternative: 'Альтернативки',
};

const titleKeys = {
  home: 'Главная',
  schedule: 'Расписание',
  alternative: 'Альтернативки',
  auth: {
    signin: 'Авторизация',
    signup: 'Регистрация',
  },
};

export function getExistingKey(location, keys) {
  let [, key, subKey] = location.pathname.split('/');
  if (typeof key === 'string' && key === '') {
    key = 'home';
  }
  if (Object.keys(keys).includes(key)) {
    if (typeof keys[key] === 'object' && subKey) {
      const subKeys = keys[key];
      if (Object.keys(subKeys).includes(subKey)) {
        return { title: subKeys[subKey], key: subKey };
      }
    } else if (typeof keys[key] === 'object' && !subKey) {
      return { title: 'Нет такой страницы', key: null };
    }
    return { title: keys[key], key: key };
  }
  return { title: 'Нет такой страницы', key: null };
}

@withRouter
class App extends React.Component {
  constructor(props) {
    super(props);
    this.toAuth = this.toAuth.bind(this);
  }

  getTitle() {
    const { location } = this.props;
    const objKey = getExistingKey(location, titleKeys);
    return objKey.title;
  }

  toAuth() {
    const { history } = this.props;
    history.push('/auth');
  }

  render() {
    return (
      <Layout>
        <Sidebar routeKeys={menuKeys} />
        <Layout>
          <Header style={{ background: '#fff' }}>
            <div className="header-inner">
              <h2>{this.getTitle()}</h2>
            </div>
          </Header>
          <Content>
            <div className="content-inner">
              <Switch>
                <Redirect from="/home" to="/" />
                <Redirect exact from="/auth" to="/auth/signin" />
                <Route exact path="/" component={Home} />
                <Route path="/auth/signin" component={Auth} />
                <Route path="/auth/signup" component={Auth} />
                <Route path="/schedule" component={Schedule} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'right' }}>
            Happa ©2018 Created by Yukioru
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
