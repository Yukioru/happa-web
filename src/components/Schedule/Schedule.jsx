import React from 'react';
import {
  Card,
  Badge,
  Modal,
  Button,
  Form,
  Input,
  TimePicker,
  DatePicker,
  Radio,
  List,
} from 'antd';
import moment from 'moment';
import cx from 'classnames';
import { Debounce } from 'lodash-decorators';
import { inject, observer } from 'mobx-react';
import EventsStore from '../../stores/EventsStore';
import ScheduleCalendar from '../ScheduleCalendar/ScheduleCalendar';

const FormItem = Form.Item;

@inject('app')
@observer
class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      modalState: 'view',
      noDateModal: false,
      modalDate: moment(),
      modalData: [],
      creatingId: null,
      modalEditData: null,
    };
    this.store = new EventsStore(false, props.app);
    this.getData = this.getData.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderViewBody = this.renderViewBody.bind(this);
  }
  componentDidMount() {
    this.getData();
  }
  componentWillUnmount() {
    this.store = null;
  }
  async getData() {
    const { app } = this.props;
    const { modalDate } = this.state;
    const monthRange = [
      moment(modalDate).subtract(1, 'months').startOf('month').toISOString(),
      moment(modalDate).add(1, 'months').endOf('month').toISOString(),
    ];
    const res = await app.api.getEventsList(monthRange);
    const resNoDate = await app.api.getEventsList(monthRange, true);
    this.store.setList(res.data);
    this.store.setList(resNoDate.data, true);
  }
  @Debounce(300)
  async handleFormChange(data) {
    const { creatingId, noDateModal } = this.state;
    const { app } = this.props;
    const preparedData = {
      ...data,
    };
    if (!noDateModal) preparedData.date = data.date.toISOString();
    if (creatingId) preparedData._id = creatingId;
    if (noDateModal && preparedData.date) preparedData.date = preparedData.date.toISOString();
    if (preparedData.startTime) preparedData.startTime = preparedData.startTime.toISOString();
    if (preparedData.finishTime) preparedData.finishTime = preparedData.finishTime.toISOString();
    if (typeof preparedData.title === 'string' && !preparedData.title) return;
    const res = await app.api.createOrUpdateEvent(preparedData);
    if (res.data) {
      this.setState({
        creatingId: res.data._id,
      });
    }
  }
  renderModal() {
    const { app } = this.props;
    const {
      openModal,
      modalData,
      modalDate,
      modalState,
      creatingId,
      noDateModal,
      modalEditData,
    } = this.state;

    if (!this.form) {
      const formOptions = {
        onValuesChange(props, values) {
          const data = {
            ...values,
          };
          if (!props.noDateModal) {
            data.date = props.date;
          }
          props.onChange(data);
        },
      };
      if (this.state.modalState === 'edit') {
        formOptions.mapPropsToFields = function mapPropsToFields(props) {
          if (props.fields) {
            const obj = {
              title: Form.createFormField({
                value: props.fields.title,
              }),
              type: Form.createFormField({
                value: props.fields.type,
              }),
            };
            if (props.fields.startTime) {
              obj.startTime = Form.createFormField({
                value: moment(props.fields.startTime),
              });
            }
            if (props.fields.finishTime) {
              obj.finishTime = Form.createFormField({
                value: moment(props.fields.finishTime),
              });
            }
            if (props.fields.description) {
              obj.description = Form.createFormField({
                value: props.fields.description,
              });
            }
            if (noDateModal && props.fields.date) {
              obj.date = Form.createFormField({
                value: props.fields.date,
              });
            }
            return obj;
          }
        };
      }
      this.form = Form.create(formOptions)((props) => {
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
                  <Radio.Button value="dayoff">Выходной</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
            {props.noDateModal && (
              <FormItem {...formItemLayout} label="Дата">
                {getFieldDecorator('date')(<DatePicker placeholder="Дата" style={{ width: 170 }} />)}
              </FormItem>
            )}
            <FormItem {...formItemLayout} label="Время начала">
              {getFieldDecorator('startTime')(<TimePicker placeholder="Время" format="HH:mm" style={{ width: 110 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Время окончания">
              {getFieldDecorator('finishTime')(<TimePicker placeholder="Время" format="HH:mm" style={{ width: 110 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Описание">
              {getFieldDecorator('description')(<Input.TextArea placeholder="Введите описание трансляции (необязательно)" autosize={{ minRows: 4 }} />)}
            </FormItem>
          </Form>
        );
      });
    }
    let CustomForm = <React.Fragment />;
    let dayData = [];
    let eveningData = [];
    let dayoffData = [];
    if (['create', 'edit'].includes(modalState)) {
      CustomForm = this.form;
    }
    if (modalState === 'view') {
      modalData.forEach((item) => {
        switch (item.type) {
          case 'day':
            dayData.push(item);
            break;
          case 'evening':
            eveningData.push(item);
            break;
          case 'dayoff':
            dayoffData.push(item);
            break;
          default:
            break;
        }
      })
    }
    return (
      <Modal
        title={`${modalState === 'create' ? 'Создание эвента в ' : ''}${noDateModal ? 'запланировно' : modalDate.format('LL')}`}
        wrapClassName={cx({
          'vertical-center-modal': true,
          'event-simple': !app.user.isAdmin || ['create', 'edit'].includes(modalState),
        })}
        visible={openModal}
        onCancel={() => {
          if (creatingId) this.getData();
          this.setState({ openModal: false }, () => {
            setTimeout(() => {
              this.form = null;
              this.setState({
                modalData: [],
                modalState: 'view',
                creatingId: null,
                modalEditData: null,
                noDateModal: false,
              });
            }, 300);
          });
        }}
        footer={app.user.isAdmin ? [
          <Button
            key="create"
            type="primary"
            onClick={() => {
              this.setState({
                modalState: 'create',
              });
            }}
          >
            Создать ещё эвент
          </Button>,
        ]: []}
      >
        {modalState === 'create' && (
          <CustomForm
            noDateModal={noDateModal}
            date={!noDateModal && modalDate}
            onChange={this.handleFormChange}
          />
        )}
        {modalState === 'edit' && (
          <CustomForm
            noDateModal={noDateModal}
            fields={modalEditData}
            date={!noDateModal && modalDate}
            onChange={this.handleFormChange}
          />
        )}
        {modalState === 'view' && dayData.map(event => {
          return this.renderViewBody(event, modalData);
        })}
        {modalState === 'view' && eveningData.map(event => {
          return this.renderViewBody(event, modalData);
        })}
        {modalState === 'view' && dayoffData.map(event => {
          return this.renderViewBody(event, modalData);
        })}
      </Modal>
    );
  }
  renderViewBody(event, modalData) {
    const { app } = this.props;
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
        {app.user.isAdmin && (
          <div className="event-footer">
            <Button
              type="dashed"
              icon="edit"
              onClick={() => {
                this.form = null;
                this.setState({
                  modalState: 'edit',
                  creatingId: event._id,
                  modalEditData: event,
                });
              }}
            >
              Изменить
            </Button>
            <Button
              type="danger"
              icon="delete"
              onClick={() => {
                this.handleDelete(event._id);
                this.setState({
                  modalData: modalData.filter(e => e._id !== event._id),
                })
              }}
            >
              Удалить
            </Button>
          </div>
        )}
      </div>
    );
  }
  async handleDelete(eventId) {
    const { app } = this.props;
    this.store.deleteEvent(eventId);
    await app.api.deleteEvent({ _id: eventId });
  }
  handlePanelChange(date, mode) {
    this.setState({
      modalDate: date,
    }, this.getData);
  }
  async handleSelect(date, data) {
    const { app } = this.props;
    const { modalDate } = this.state;
    const isDate = !moment(modalDate).isSame(moment(date), 'month');
    let newState = {
      openModal: !!data.length,
      modalDate: date,
      modalData: data,
    };
    if (app.user.isAdmin) {
      newState = {
        ...newState,
        openModal: true,
        modalData: data,
        modalState: !data.length ? 'create' : 'view',
      }
    }
    await new Promise(r => this.setState(newState, r));
    if (isDate) {
      await this.getData();
    }
  }
  render() {
    const { app } = this.props;
    return (
      <React.Fragment>
        <h1 className="frame-title">Запланировано, но ещё нет в расписании</h1>
        <div className="frame-content">
          <List
            bordered
            style={{
              background: '#fff',
              marginBottom: 32,
            }}
            dataSource={this.store.noDateList}
            renderItem={event => (
              <List.Item
                style={app.user.isAdmin ? {
                  cursor: 'pointer',
                } : {}}
                onClick={app.user.isAdmin ? () => {
                  this.form = null;
                  this.setState({
                    openModal: true,
                    noDateModal: true,
                    modalState: 'edit',
                    creatingId: event._id,
                    modalEditData: event,
                  })
                } : null}
              >
                {event.title}
              </List.Item>
            )}
          />
        </div>
        <h1 className="frame-title">
          Расписание стримчанов Хаппитана
          {app.user.isAdmin && (
            <Button
              style={{ marginLeft: 12 }}
              onClick={() => {
                this.form = null;
                this.setState({
                  openModal: true,
                  modalState: 'create',
                  noDateModal: true,
                })
              }}
            >
              Создать эвент
            </Button>
          )}
        </h1>
        {this.renderModal()}
        <div style={{ overflow: 'auto' }}>
          <Card bodyStyle={{ padding: 0 }} style={{ minWidth: 790 }}>
            <ScheduleCalendar
              list={this.store.list}
              onPanelChange={this.handlePanelChange}
              onSelect={this.handleSelect}
            />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default Schedule;