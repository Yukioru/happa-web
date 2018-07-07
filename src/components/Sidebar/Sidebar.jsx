import React from 'react';
import { Layout, BackTop } from 'antd';
import { inject, observer } from 'mobx-react';
import Menu from '../Menu';
import Logo from '../Logo';
import SidebarUser from '../SidebarUser';

@inject('app')
@observer
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };

    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse(collapsed) {
    this.setState({ collapsed });
  }

  render() {
    const { collapsed } = this.state;
    const { routeKeys, app } = this.props;
    return (
      <Layout.Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={this.handleCollapse}
      >
        <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <Logo />
          <SidebarUser />
          <Menu routeKeys={routeKeys} isAuth={app.user.isAuth} />
        </div>
        <BackTop />
      </Layout.Sider>
    );
  }
}

export default Sidebar;
