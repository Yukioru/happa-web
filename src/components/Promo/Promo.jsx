import React from 'react';
import { Spin, Icon, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import ParallaxMousemove from 'react-parallax-mousemove';

const style = {
  outter: {
    width:'100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  bgLayerStyle: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    transform: 'translate(0, 0)',
  }
};

@inject('app')
@observer
class Promo extends React.Component {
  state = {
    loading: false,
    channel: null,
    stream: null,
  }
  componentDidMount() {
    this.getData();
  }
  async getData() {
    await new Promise(res => this.setState({ loading: true }, res));
    const channel = await this.props.app.api.getChannel();
    const stream = await this.props.app.api.getStream();
    await new Promise(res => this.setState({ loading: false, channel, stream }, res));
  }
  renderBlank() {
    const { channel } = this.state;
    if (!channel) return;
    return (
      <React.Fragment>
        <ParallaxMousemove.Layer
          layerStyle={style.bgLayerStyle}
          config={{
            xFactor: 0.05,
            yFactor: 0.05,
            springSettings: {
              stiffness: 15,
              damping: 35,
            }
          }}
        >
          <div
            className="full-promo-background"
            style={{ backgroundImage: `url(${channel.profile_banner})` }}
          />
        </ParallaxMousemove.Layer>
        <div className="full-promo-foreground">
          <div className="full-promo-inner">
            <h1 className="full-promo-heading">Сейчас стрима нет</h1>
            <div className="full-promo-content">
              <p className="full-promo-info">Что было в прошлый раз:</p>
              <div className="full-promo-flex">
                <div className="full-promo-game">
                  <Icon type=" fas fa-gamepad" />
                  <span>{channel.game}</span>
                </div>
                <div className="full-promo-game">
                  <Icon type=" fas fa-info-circle" />
                  <span>{channel.status}</span>
                </div>
              </div>
              <Button
                ghost
                type="dashed"
                icon=" fab fa-twitch"
                href={channel.url}
              >
                Перейти на канал
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  renderLive() {
    const { stream } = this.state;
    if (!stream) return;
    return (
      <React.Fragment>
        <ParallaxMousemove.Layer
          layerStyle={style.bgLayerStyle}
          config={{
            xFactor: 0.05,
            yFactor: 0.05,
            springSettings: {
              stiffness: 15,
              damping: 35,
            }
          }}
        >
          <div
            className="full-promo-background"
            style={{ backgroundImage: `url(${stream.channel.profile_banner})` }}
          />
        </ParallaxMousemove.Layer>
        <div className="full-promo-foreground">
          <div className="full-promo-inner">
            <h1 className="full-promo-heading">Хаппитан в эфире!</h1>
            <div className="full-promo-content">
              <p className="full-promo-info">Сейчас стримит:</p>
              <div className="full-promo-flex">
                <div className="full-promo-game">
                  <Icon type=" fas fa-eye" />
                  <span>{stream.viewers}</span>
                </div>
                <div className="full-promo-game">
                  <Icon type=" fas fa-gamepad" />
                  <span>{stream.game}</span>
                </div>
                <div className="full-promo-game">
                  <Icon type=" fas fa-info-circle" />
                  <span>{stream.channel.status}</span>
                </div>
              </div>
            </div>
            <Button
              ghost
              type="dashed"
              icon=" fab fa-twitch"
              href={stream.channel.url}
            >
              Перейти на канал
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
  render() {
    const { stream, loading } = this.state;
    const antIcon = <Icon type="loading" style={{ fontSize: 32 }} spin />;
    return (
      <Spin spinning={loading} indicator={antIcon}>
        <section className="full-promo">
          <ParallaxMousemove containerStyle={style.outter}>
            {!!stream ? this.renderLive() : this.renderBlank()}
          </ParallaxMousemove>
        </section>
      </Spin>
    );
  }
}

export default Promo;
