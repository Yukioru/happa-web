import React from 'react';
import Layout from 'antd/lib/layout';
import Menu from '../Menu';
import Logo from '../Logo';
import SidebarUser from '../SidebarUser';
import './Sidebar.css';

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
    const { routeKeys } = this.props;
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
          <Menu routeKeys={routeKeys} />
        </div>
      </Layout.Sider>
    );
  }
}

export default Sidebar;
