import React from 'react';
import { inject } from 'mobx-react';
import { Menu as AntdMenu, Icon } from 'antd';
import withRouter from 'react-router-dom/withRouter';
import { getExistingKey } from '../App';

@inject('app')
@withRouter
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuKey: '',
    };

    this.handleClickedMenu = this.handleClickedMenu.bind(this);
  }

  componentDidMount() {
    const { location, routeKeys } = this.props;
    this.setState({
      selectedMenuKey: getExistingKey(location, routeKeys).key,
    });
  }

  handleClickedMenu({ key: selectedMenuKey, ...etc }) {
    const { history } = this.props;
    this.setState({ selectedMenuKey });
    if (selectedMenuKey === 'logout') {
      document.location.replace(`/api/${selectedMenuKey}`);
    } else {
      history.push(`/${selectedMenuKey}`);
    }
  }

  render() {
    const { selectedMenuKey } = this.state;
    const { routeKeys, app } = this.props;
    const authKeys = {
      auth: 'Войти',
      logout: 'Выйти',
    };
    const authArray = Object.keys(authKeys).map(key => {
      let show = true;
      let icon = 'home';
      if (key === 'auth') {
        show = !app.user.isAuth;
        icon = 'login';
      }
      if (key === 'logout') {
        show = app.user.isAuth;
        icon = key;
      }
      return { title: authKeys[key], key, icon, show };
    }).filter(e => e.show);

    const menuArray = Object.keys(routeKeys).map(key => {
      let icon = 'home';
      if (key === 'schedule') icon = 'calendar';
      if (key === 'alternative') icon = 'solution';
      return { title: routeKeys[key], key, icon };
    });
    return (
      <AntdMenu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedMenuKey]}
        onClick={this.handleClickedMenu}
      >
        <AntdMenu.ItemGroup title="Авторизация">
          {authArray.map(item => (
            <AntdMenu.Item key={item.key}>
              <Icon type={item.icon} />
              <span className="nav-text">{item.title}</span>
            </AntdMenu.Item>
          ))}
        </AntdMenu.ItemGroup>
        <AntdMenu.ItemGroup title="Навигация">
          {menuArray.map(item => (
            <AntdMenu.Item key={item.key}>
              <Icon type={item.icon} />
              <span className="nav-text">{item.title}</span>
            </AntdMenu.Item>
          ))}
        </AntdMenu.ItemGroup>
      </AntdMenu>
    );
  }
}

export default Menu;
