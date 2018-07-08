import React from 'react';
import cx from 'classnames';

class Logo extends React.PureComponent {
  flickers = [3, 5, 7, 9, 11, 13, 15];
  state = {
    flickerNumber: 0,
    counter: 0,
    off: false,
  }
  timeoutFlicker = null;
  timeoutLoop = null;
  componentDidMount() {
    this.loop();
  }
  componentWillUnmount() {
    clearTimeout(this.timeoutFlicker);
    clearTimeout(this.timeoutLoop);
  }
  flicker = () => {
    const { flickerNumber } = this.state;
    let { counter, off } = this.state;
    counter += 1;
    
    if (counter === flickerNumber) {
      return;
    }
  
    this.timeoutFlicker = setTimeout(() => {
      this.setState({
        counter,
        off: !off,
      }, () => {
        this.flicker();
      });
    }, 30);
  }
  randomFromInterval(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }
  loop = () => {
    let { flickerNumber } = this.state;
    const rand = this.randomFromInterval(500, 8000);
    
    flickerNumber = this.randomFromInterval(0, 6);
    flickerNumber = this.flickers[flickerNumber];

    this.timeoutLoop = setTimeout(() => {
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