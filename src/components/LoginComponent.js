import React, {Component} from 'react';
import {Form, FormGroup, Input, Button} from 'reactstrap';
import {getRenderedErrors} from "../utils";
import * as settings from '../settings';
import * as ajaxEntities from '../ajaxEntities';
import axios from 'axios';
import {saveAPIToken, startAjax, stopAjax} from "../actions";


export class Login extends Component {
    constructor(props) {
        super(props);
        this.emptyErrors = {
            non_field_errors: [],
            username: [],
            password: []
        };
        this.state = {
            username: '',
            password: '',
            remember_me: false,
            errors: this.emptyErrors,
            submitDisabled: false
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value, errors: this.emptyErrors});
    };
    onCheckboxChange = (e) => {
        this.setState({remember_me: e.target.checked});
    };
    handleSubmit = () => {
        const data = (({username, password}) => ({username, password}))(this.state);
        this.props.dispatch(startAjax(ajaxEntities.LOGIN));
        axios.post(settings.LOGIN_URL, data).then((resp) => {
            const key = resp.data.key;
            this.props.dispatch(saveAPIToken(key));
            this.props.dispatch(stopAjax(ajaxEntities.LOGIN));
        }).catch((err) => {
            const errors = err.response.data;
            this.setState({errors: {...this.state.errors, ...errors}});
            this.props.dispatch(stopAjax(ajaxEntities.LOGIN));
        });
    };
    onForgotPasswordClick = () => {
        alert('Forgot password. Implement');
    };

    render() {
        const nonFieldErrors = getRenderedErrors(this.state.errors.non_field_errors);
        const usernameErrors = getRenderedErrors(this.state.errors.username);
        const passwordErrors = getRenderedErrors(this.state.errors.password);

        return <div id="login" className="navtab-content is-active">
            <form>

                <div className="control">
                    <label className="auth-label">Username*</label>
                    <input type="text" className="input" placeholder="" name="username" id="idUsername"
                           value={this.state.username} onChange={this.onChange}/>
                </div>
                {usernameErrors}
                <div className="control">
                    <label className="auth-label">Password*</label>
                    <input className="input" placeholder=""
                           type="password" name="password" id="idPassword"
                           value={this.state.password} onChange={this.onChange}/>
                </div>
                {passwordErrors}
                {nonFieldErrors}
                <div className="control">
                    <label className="checkbox-wrap is-small">
                        <input id="house" type="checkbox" className="d-checkbox"
                               checked={this.props.remember_me} onChange={this.onCheckboxChange}/>
                        <span> </span>
                        <small>Remember me?</small>
                    </label>
                </div>

                <div className="button-wrapper">
                    <button type="button" className="button feather-button is-small primary-button upper-button raised"
                    onClick={this.handleSubmit}
                    disabled={this.state.submitDisabled}>
                        <span>Login</span>
                    </button>
                    <a className="forgotten" onClick={this.onForgotPasswordClick}>Forgot Password ?</a>
                </div>
            </form>
        </div>;
    }
}
