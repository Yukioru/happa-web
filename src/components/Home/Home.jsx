import React from 'react';
import Promo from '../Promo';
import TopClips from '../TopClips';

class Home extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Promo />
        <TopClips />
      </React.Fragment>
    );
  }
}

export default Home;
