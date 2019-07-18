import React, {Component} from 'react';
import '../styles.scss';
import {store} from "../app";
import {
    resetImageRegFormErrors,
    setImageRegFormError,
    setImageRegFormRegFee,
    setImageRegWorkerFee,
    setRegFee
} from "../actions";
import {RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK} from "../constants";
import {MainWrapper} from "./MainWrapperComponent";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('imageRegFormSubmitResponse', (event, data) => {
    switch (data.status) {
        case RESPONSE_STATUS_ERROR:
            store.dispatch(setImageRegFormError('all', data.msg));
            break;
        case RESPONSE_STATUS_OK:
            store.dispatch(resetImageRegFormErrors());
            store.dispatch(setImageRegFormRegFee(data.regFee));
            break;
        default:
            break;
    }
});

ipcRenderer.on('imageRegFormProceedResponse', (event, data) => {
    console.log('imageRegFormProceedResponse RECEIVED');
    console.log(data);
    switch (data.status) {
        case RESPONSE_STATUS_ERROR:
            store.dispatch(setImageRegFormError('all', data.msg));
            break;
        case RESPONSE_STATUS_OK:
            store.dispatch(resetImageRegFormErrors());
            store.dispatch(setImageRegWorkerFee(data.fee));
            break;
        default:
            break;
    }
});

export class ImageRegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            artName: '',
            numCopies: 0,
            copyPrice: 0,
            filePath: ''
        }
    }

    componentDidMount() {
        document.title = 'Pastel wallet';
    }

    validateImageRegForm = () => {
        let isValid = true;
        if (this.state.artName === '') {
            this.props.dispatch(setImageRegFormError('artName', 'Art name should not be empty'))
            isValid = false;
        }
        if (this.state.filePath === '') {
            this.props.dispatch(setImageRegFormError('artFile', 'Please select art image file'))
            isValid = false;
        }
        return isValid;
    };

    onFormSubmit = (e) => {
        // TODO: validate form. Name and file should not be empty
        e.preventDefault();
        if (this.validateImageRegForm()) {
            let data = this.state;
            ipcRenderer.send('imageRegFormSubmit', data);
        }
    };
    onProceedClick = (e) => {
        //TODO: create image registration ticket
        //TODO: calculate image hash
        e.preventDefault();
        let data = {
            name: this.state.artName,
            filePath: this.state.filePath
        };
        ipcRenderer.send('imageRegFormProceed', data);
    };
    onAddFile = (e) => {
        if (Object.entries(this.props.regFormError).length !== 0) {
            store.dispatch(resetImageRegFormErrors());
        }
        let file = e.target.files[0];
        this.setState({file: URL.createObjectURL(file), filePath: file.path});
    };
    onChange = (e) => {
        if (Object.entries(this.props.regFormError).length !== 0) {
            store.dispatch(resetImageRegFormErrors());
        }
        this.setState({[e.target.name]: e.target.value});
    };

    render() {
        return <MainWrapper>
            <div className="columns is-multiline">
                <div className="column">
                    <div className="flat-card profile-info-card is-auto">

                        <div className="card-title">
                            <h3>Register image</h3>
                        </div>

                        <div className="card-body send-psl-card-body">
                            <div className="columns">
                                <form className="send-psl-form">
                                    <div className="info-block">
                                        <span className="label-text">Art name</span>
                                        <div className="control">
                                            <input type="text" className="input is-default" name="artName"
                                                   value={this.state.artName} onChange={this.onChange}/>
                                        </div>
                                        <div className={this.props.regFormError.artName ? '' : 'display-none'}>
                                            <div className="reg-form-error">
                                                {this.props.regFormError.artName}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="info-block">
                                        <span className="label-text">Number of copies</span>
                                        <div className="control">
                                            <input type="number"
                                                   value={this.state.numCopies} name="numCopies"
                                                   onChange={this.onChange}
                                                   className="input is-default"/>
                                        </div>
                                    </div>
                                    <div className="info-block">
                                        <span className="label-text">Price of the copy, PSL</span>
                                        <div className="control">
                                            <input type="number" step="0.0001"
                                                   value={this.state.copyPrice} name="copyPrice"
                                                   onChange={this.onChange}
                                                   className="input is-default"/>
                                        </div>
                                    </div>
                                    <div className="info-block">
                                        <div className={this.state.file ? '' : 'display-none'}>
                                            <div className="flex-row flex-centered">
                                                <img src={this.state.file} className="img-preview pb-1" alt=""/>
                                            </div>
                                        </div>
                                        <span className="label-text">Art file</span>
                                        <div>
                                            <input type="file" accept="image/*" id="idArtFile"
                                                   onChange={this.onAddFile}/>
                                        </div>
                                        <div className={this.props.regFormError.artFile ? '' : 'display-none'}>
                                            <div className="reg-form-error">
                                                {this.props.regFormError.artFile}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex-centered">
                                        <div className={this.props.regFormFee ? 'display-none' : ''}>
                                            <div className="flex-centered">
                                                <button
                                                    className="button
                                            cart-button secondary-button upper-button rounded is-bold raised"
                                                    onClick={this.onFormSubmit}>
                                                    Register
                                                </button>
                                            </div>
                                            <div className="flex-centered">
                                                <div className={this.props.regFormError.all ? '' : 'display-none'}>
                                                    <div className="reg-form-error">
                                                        {this.props.regFormError.all}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={this.props.regFormFee ? '' : 'display-none'}>
                                            <div className="regfee-msg">Preliminary network
                                                fee: {this.props.regFormFee} PSL
                                            </div>
                                            <button
                                                className="button
                                            cart-button secondary-button upper-button rounded is-bold raised"
                                                onClick={this.onProceedClick}>
                                                Proceed
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>;
    }
}