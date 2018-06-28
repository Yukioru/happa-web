import React from 'react';
import { Menu as AntdMenu, Icon } from 'antd';
import withRouter from 'react-router-dom/withRouter';
import { getExistingKey } from '../App';

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

  handleClickedMenu({ key: selectedMenuKey }) {
    const { history } = this.props;
    this.setState({ selectedMenuKey });
    history.push(`/${selectedMenuKey}`);
  }

  render() {
    const { selectedMenuKey } = this.state;
    const { routeKeys } = this.props;
    const menuArray = Object.keys(routeKeys)
      .map(key => {
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
        {menuArray.map(item => (
          <AntdMenu.Item key={item.key}>
            <Icon type={item.icon} />
            <span className="nav-text">{item.title}</span>
          </AntdMenu.Item>
        ))}
      </AntdMenu>
    );
  }
}

export default Menu;
