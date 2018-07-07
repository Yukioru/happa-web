import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Modal, Icon } from 'antd';
import Slider from 'react-slick';

@inject('app')
@observer
class TopClips extends React.Component {
  state = {
    data: [],
    loading: true,
  }
  componentDidMount() {
    this.getData();
  }
  async getData() {
    const { app } = this.props;
    const data = await app.api.getTopClips();
    this.setState({ data }, () => {
      setTimeout(() => {
        this.setState({  loading: false });
      }, 300);
    });
  }
  renderItem(item) {
    const { loading } = this.state;
    return (
      <React.Fragment>
        <Card
          loading={loading}
          hoverable={!loading}
          cover={!loading && <img alt="example" src={item.thumbnails.medium} />}
          className="frame-slider-item"
          onClick={!loading ? () => {
            this.setState({
              [`visibleModal${item.slug}`]: true,
            })
          } : null}
        >
          <Card.Meta
            title={item.title}
            description={item.views}
          />
        </Card>
        {this.renderModal(item)}
      </React.Fragment>
    );
  }
  renderModal(item) {
    const isVisible = this.state[`visibleModal${item.slug}`] || false;
    return (
      <Modal
        width={640}
        title={item.title}
        wrapClassName="vertical-center-modal twitch-embed"
        visible={isVisible}
        onCancel={() => {
          this.setState({
            [`visibleModal${item.slug}`]: false,
          })
        }}
      >
        <div className="embed-responsive embed-responsive-16by9">
          <div className="embed-responsive-item phantom-item">
            <Icon type="loading" style={{ fontSize: 32 }} spin />
          </div>
          {this.state[`visibleModal${item.slug}`] && (
            <iframe
              title={item.slug}
              src={item.embed_url}
              className="embed-responsive-item"
              frameBorder={0}
              scrolling="no"
              allowFullScreen
            />
          )}
        </div>
      </Modal>
    );
  }
  render() {
    const { data } = this.state;
    const settings = {
      dots: true,
      infinite: false,
      speed: 1000,
      draggable: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };
    return (
      <div className="frame">
        <h1 className="frame-title">Топ 10 клипов</h1>
        <div className="frame-slider">
          <Slider {...settings}>
            {!!data.length ? (
              data.map(item => (
                <div key={item.slug}>
                  {this.renderItem(item)}
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map(item => (
                <div key={item}>
                  <Card loading className="frame-slider-item" />
                </div>
              ))
            )}
          </Slider>
        </div>
      </div>
    );
  }
}

export default TopClips;