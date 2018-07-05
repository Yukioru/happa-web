import React from 'react';
import cx from 'classnames';
import './Logo.css';

class Logo extends React.PureComponent {
  flickers = [5, 7, 9, 11, 13, 15, 17];
  state = {
    flickerNumber: 0,
    counter: 0,
    off: false,
  }
  componentDidMount() {
    this.loop();
  }
  flicker = () => {
    const { flickerNumber } = this.state;
    let { counter, off } = this.state;
    counter += 1;
    
    if (counter === flickerNumber) {
      return;
    }
  
    setTimeout(() => {
      this.setState({
        counter,
        off: !off,
      });
      this.flicker();
    }, 40);
  }
  randomFromInterval(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }
  loop = () => {
    let { flickerNumber } = this.state;
    const rand = this.randomFromInterval(300, 800);
    
    flickerNumber = this.randomFromInterval(0, 6);
    flickerNumber = this.flickers[flickerNumber];

      setTimeout(() => {
        this.setState({
          flickerNumber,
          counter: 0,
        }, () => {
          this.flicker();
          this.loop();
        });
      }, rand);
  }
  render() {
    const { off } = this.state;
    return (
      <div className={cx({ logo: true, off })}>
        <div className="logo-text">Happa<span>TV</span></div>
        <i className="fas fa-tv" />
      </div>
    );
  }
}

export default Logo;