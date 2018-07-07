import React from 'react';
import {
  Card,
  Calendar as AntdCalendar,
  Badge,
  Modal,
  Button,
  Form,
  Input,
  TimePicker,
  Radio,
} from 'antd';
import moment from 'moment';
import cx from 'classnames';
import { Debounce } from 'lodash-decorators';
import { inject, observer } from 'mobx-react';

const FormItem = Form.Item;

const mock = [
  {
    _id: 1,
    date: new Date('2018-07-05'),
    title: 'Hearthstone',
    type: 'day',
  },
  {
    _id: 2,
    date: new Date('2018-07-06'),
    title: 'Выходной',
    type: 'dayoff',
  },
  {
    _id: 3,
    date: new Date('2018-07-07'),
    title: 'АРЕНЫ 2.0',
    type: 'day',
  },
  {
    _id: 4,
    date: new Date('2018-07-07'),
    title: 'Undercards',
    type: 'evening',
  },
  {
    _id: 5,
    date: new Date('2018-07-08'),
    title: '♂ Draconell Day ♂',
    type: 'day',
    startTime: new Date('2018-07-08 17:00'),
    finishTime: new Date('2018-07-09 01:00'),
    description: `Очень крутое описание!
      В программе дня:
      - JoJo!!!
      - Realm Royale
      - Overwatch`,
  },
];

@inject('app')
@observer
class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      modalDate: moment(),
      modalData: [],
      newModalEvent: false,
      creatingData: {},
    };
    this.getListData = this.getListData.bind(this);
    this.dateCellRender = this.dateCellRender.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }
  isSameDate(one, two) {
    return moment(one).isSame(moment(two), 'day');
  }
  getListData(value) {
    return mock.filter(e => this.isSameDate(value, e.date));
  }
  dateCellRender(value) {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => {
          let status = 'success';
          if (item.type === 'evening') status = 'warning';
          if (item.type === 'dayoff') status = 'default';
          return (
            <li key={item._id}>
              <Badge status={status} text={item.title} />
            </li>
          );
        })}
      </ul>
    );
  }
  @Debounce(300)
  async handleFormChange(data) {
    console.log('handleFormChange', data);
    const { creatingData } = this.state;
    const { app } = this.props;
    const preparedData = {
      ...data,
      date: data.date.toISOString(),
    };
    if (creatingData._id) preparedData._id = creatingData._id;
    if (preparedData.startTime) preparedData.startTime = preparedData.startTime.toISOString();
    if (preparedData.finishTime) preparedData.finishTime = preparedData.finishTime.toISOString();
    console.log('preparedData', preparedData);
    const res = await app.api.createOrUpdateEvent(preparedData);
    if (res.data) {
      this.setState({
        creatingData: res.data,
      });
    }
  }
  renderModal() {
    const { app } = this.props;
    const { openModal, modalData, modalDate, newModalEvent, creatingData } = this.state;
    let CustomForm = <React.Fragment />
    if (newModalEvent) {
      CustomForm = Form.create({
        mapPropsToFields(props) {
          return {
            title: Form.createFormField({
              value: props.fields.title,
            }),
            type: Form.createFormField({
              value: props.fields.type,
            }),
            startTime: Form.createFormField({
              value: props.fields.startTime,
            }),
            finishTime: Form.createFormField({
              value: props.fields.finishTime,
            }),
            description: Form.createFormField({
              value: props.fields.description,
            }),
          };
        },
        onValuesChange(props, values) {
          props.onChange({
            ...values,
            date: props.date,
          });
        },
      })((props) => {
        const { getFieldDecorator } = props.form;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };
        return (
          <Form>
            <FormItem {...formItemLayout} label="Название">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Название обязательно!' }],
              })(<Input type="text" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Тип трансляции">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: 'Тип трансляции обязателен!' }],
              })(
                <Radio.Group>
                  <Radio.Button value="day">День</Radio.Button>
                  <Radio.Button value="evening">Вечер</Radio.Button>
                  <Radio.Button value="offday">Выыходной</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
      
            <FormItem {...formItemLayout} label="Время начала">
              {getFieldDecorator('startTime')(<TimePicker style={{ width: 175 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Время окончания">
              {getFieldDecorator('finishTime')(<TimePicker style={{ width: 175 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Описание">
              {getFieldDecorator('description')(<Input.TextArea placeholder="Введите описание трансляции (необязательно)" autosize={{ minRows: 4 }} />)}
            </FormItem>
          </Form>
        );
      });
    }
    return (
      <Modal
        title={`${newModalEvent ? 'Создание эвента в ' : ''}${modalDate.format('LL')}`}
        wrapClassName={cx({
          'vertical-center-modal': true,
          'event-simple': !app.user.isAdmin || newModalEvent,
        })}
        visible={openModal}
        onCancel={() => {
          this.setState({
            openModal: false,
          }, () => {
            setTimeout(() => {
              this.setState({
                modalData: [],
                modalDate: moment(),
                creatingData: {},
              });
            }, 300);
          });
        }}
        footer={app.user.isAdmin ? [
          <Button key="edit">Изменить</Button>,
          <Button key="create" type="primary">
            Создать ещё эвент
          </Button>,
        ]: []}
      >
        {newModalEvent ? (
          <CustomForm fields={creatingData} date={modalDate} onChange={this.handleFormChange} />
        ) : (
          modalData.map(event => {
            let status = 'success';
            let statusTitle = 'День';
            if (event.type === 'evening') {
              status = 'warning';
              statusTitle = 'Вечер';
            }
            if (event.type === 'dayoff') {
              status = 'default';
              statusTitle = 'Выходной';
            }
            return (
              <div
                key={event._id}
                className={cx({
                  'event-shedule': true,
                  [`event-${event.type}`]: true,
                })}
              >
                <h3 className="event-title">{event.title}</h3>
                <Badge status={status} text={statusTitle} />
                {event.startTime && (
                  <div className="event-meta">
                    <span className="event-meta-title">Начало в</span>
                    <span className="event-meta-value">
                      {`${moment(event.startTime).format('LT')} по Московскому времени`}
                    </span>
                  </div>
                )}
                {event.finishTime && (
                  <div className="event-meta">
                    <span className="event-meta-title">Окончание в</span>
                    <span className="event-meta-value">
                      {`${moment(event.finishTime).format('LT')} по Московскому времени`}
                    </span>
                  </div>
                )}
                {event.description && (
                  <div className="event-meta alternative">
                    <span className="event-meta-title">Описание:</span>
                    <span className="event-meta-value">
                      {event.description}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </Modal>
    );
  }
  render() {
    return (
      <React.Fragment>
        <h1>Расписание стримчанов Хаппитана</h1>
        {this.renderModal()}
        <div style={{ overflow: 'auto' }}>
          <Card bodyStyle={{ padding: 0 }} style={{ minWidth: 790 }}>
            <AntdCalendar
              className="simple-schedule"
              dateCellRender={this.dateCellRender}
              onSelect={(date) => {
                console.log(date);
                const data = this.getListData(date);
                this.setState({
                  openModal: true,
                  modalDate: date,
                  modalData: data,
                  newModalEvent: !data.length,
                });
              }}
            />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default Schedule;