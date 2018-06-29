import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button } from 'antd';
import Axios from 'axios';
import './Auth.css';

const FormItem = Form.Item;

@withRouter
@Form.create()
class Auth extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 'signin',
      confirmDirty: false,
      code: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
  }

  componentDidMount() {
    this.getType();
  }
  
  componentDidUpdate() {
    this.getType();
  }

  getType() {
    const { match } = this.props;
    const [,, type] = match.path.split('/');
    this.setState({ type });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const result = await Axios.post(`/api/auth/${this.state.type}`, values);
        console.log('result', result);
      }
    });
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Введённые пароли не совпадают!');
    } else {
      callback();
    }
  }

  render() {
    const { type } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              message: 'Пожалуйста введите имя пользователя!',
            }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Имя пользователя"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: 'Пожалуйста введите пароль!',
            }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Пароль"
            />
          )}
        </FormItem>
        {type === 'signup' && (
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Повторно введите ваш пароль!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Повтор пароля"
              onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>
        )}
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {type === 'signin' && 'Авторизоваться'}
            {type === 'signup' && 'Зарегистрироваться'}
          </Button>
          {type === 'signin' && (
            <React.Fragment>
              Или <Link to="/auth/signup">зарегистрироваться сейчас!</Link>
            </React.Fragment>
          )}
          {type === 'signup' && (
            <React.Fragment>
              Или <Link to="/auth/signin">войти в аккаунт!</Link>
            </React.Fragment>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Auth;
