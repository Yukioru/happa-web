import React from 'react';
import { inject, observer } from 'mobx-react';
import './SidebarUser.css';

@inject('app')
@observer
class SidebarUser extends React.Component {
  render() {
    const { app } = this.props;
    if (!app.user.isAuth) return false;
    return (
      <div className="sideuser-wrapper">
        <div
          className="sideuser-avatar"
          style={{
            backgroundImage: `url(${app.user.avatar})`,
          }}
        />
        <p className="sideuser-name">{app.user.displayName}</p>
      </div>
    );
  }
}

export default SidebarUser;
