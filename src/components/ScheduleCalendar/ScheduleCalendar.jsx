import React from 'react';
import moment from 'moment';
import { Calendar, Badge } from 'antd';

class ScheduleCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.getListData = this.getListData.bind(this);
    this.dateCellRender = this.dateCellRender.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  isSameDate(one, two) {
    return moment(one).isSame(moment(two), 'day');
  }
  getListData(value) {
    const { list } = this.props;
    return list.filter(e => this.isSameDate(value, e.date));
  }
  dateCellRender(value) {
    const listData = this.getListData(value);
    let dayData = [];
    let eveningData = [];
    let dayoffData = [];
    listData.forEach((item) => {
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
    return (
      <ul className="events">
        {dayData.map(this.renderCellBody)}
        {eveningData.map(this.renderCellBody)}
        {dayoffData.map(this.renderCellBody)}
      </ul>
    );
  }
  renderCellBody(item) {
    let status = 'success';
    if (item.type === 'evening') status = 'warning';
    if (item.type === 'dayoff') status = 'default';
    return (
      <li key={item._id}>
        <Badge status={status} text={item.title} />
      </li>
    );
  }
  handleSelect(date) {
    const { onSelect } = this.props;
    const data = this.getListData(date);
    onSelect(date, data);
  }
  render() {
    const { onPanelChange } = this.props;
    return (
      <Calendar
        className="simple-schedule"
        dateCellRender={this.dateCellRender}
        onPanelChange={onPanelChange}
        onSelect={this.handleSelect}
      />
    );
  }
}

export default ScheduleCalendar;