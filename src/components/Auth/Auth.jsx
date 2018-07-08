import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Alert, Form, Icon, Input, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import Axios from 'axios';

const FormItem = Form.Item;

@inject('app')
@observer
@withRouter
@Form.create()
class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'signin',
      confirmDirty: false,
      error: null,
      authLoading: false,
    };
    this.closeAlert = this.closeAlert.bind(this);
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
    const { type: currentType } = this.state;
    const { match } = this.props;
    const [,, type] = match.path.split('/');
    if (currentType === type) return;
    this.setState({ type });
  }

  async handleSubmit(e) {
    const { app, history } = this.props;
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await new Promise((resolve) => {
          this.setState({ authLoading: true }, resolve);
        });
        const { data: result } = await Axios.post(`/api/auth/${this.state.type}`, values);
        await new Promise((resolve) => {
          this.setState({ authLoading: false }, resolve);
        });
        if (result.code === 200) {
          this.setState({ error: null });
          app.user.setUser(result.data);
          history.push('/');
        } else {
          this.setState({ error: result.message });
        }
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

  closeAlert() {
    this.setState({ error: null });
  }

  render() {
    const { type, authLoading, error } = this.state;
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
        {error && (
          <FormItem>
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={this.closeAlert}
            />
          </FormItem>
        )}
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={authLoading}
          >
            {type === 'signin' && 'Авторизоваться'}
            {type === 'signup' && 'Зарегистрироваться'}
          </Button>

          <Button
            type="primary"
            className="twitch-button"
            icon=" fab fa-twitch"
            href="/api/auth/twitch"
          >
            Войти через Twitch
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
