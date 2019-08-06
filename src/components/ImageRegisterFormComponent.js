import React, {Component} from 'react';
import '../styles.scss';
import {store} from "../app";
import {
    resetImageRegFormErrors,
    setImageRegFormError,
    setImageRegFormRegFee, setImageRegFormState, setImageRegTicketID,
    setImageRegWorkerFee,
    setRegFee
} from "../actions";
import history from '../history';
import * as constants from '../constants';
import {MainWrapper} from "./MainWrapperComponent";
import {BarLoader} from 'react-spinners';

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('imageRegFormSubmitResponse', (event, data) => {
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setImageRegFormError('all', data.msg));
            store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ERROR));
            break;
        case constants.RESPONSE_STATUS_OK:
            store.dispatch(resetImageRegFormErrors());
            store.dispatch(setImageRegFormRegFee(data.regFee));
            store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_PREL_FEE_RECEIVED));
            break;
        default:
            break;
    }
});

ipcRenderer.on('imageRegFormProceedResponse', (event, data) => {
    console.log('imageRegFormProceedResponse RECEIVED');
    console.log(data);
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setImageRegFormError('all', data.msg));
            store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ERROR));
            break;
        case constants.RESPONSE_STATUS_OK:
            store.dispatch(resetImageRegFormErrors());
            store.dispatch(setImageRegWorkerFee(data.fee));
            store.dispatch(setImageRegTicketID(data.regticket_id));
            store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_WORKER_FEE_RECEIVED));
            break;
        default:
            break;
    }
});

ipcRenderer.on('imageRegFormStep3Response', (event, data) => {
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setImageRegFormError('all', data.msg));
            store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_ERROR));
            break;
        case constants.RESPONSE_STATUS_OK:
            store.dispatch(resetImageRegFormErrors());
            store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_MN_2_3_RESPONSE_RECEIVED));
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
        e.preventDefault();
        if (this.validateImageRegForm()) {
            let data = this.state;
            ipcRenderer.send('imageRegFormSubmit', data);
        }
    };
    onProceedClick = (e) => {
        e.preventDefault();
        let data = {
            name: this.state.artName,
            filePath: this.state.filePath
        };
        ipcRenderer.send('imageRegFormProceed', data);
        store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_REQUESTING_NETWORK));
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
    onReturnClick = (e) => {
        e.preventDefault();
        this.props.dispatch(resetImageRegFormErrors());
        this.props.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_DEFAULT));
        ipcRenderer.send('imageRegFormCancel', {regticketId: this.props.regticketId});
        this.props.dispatch(setImageRegTicketID(null));
        history.push('/');
    };
    onAcceptStep3Click = (e) => {
        e.preventDefault();
        ipcRenderer.send('imageRegFormStep3', {regticketId: this.props.regticketId});
        this.props.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_SEND_REGTICKET_MN_2_3));
    };
    render() {
        let buttonArea;
        switch (this.props.regFormState) {
            case constants.IMAGE_REG_FORM_STATE_ERROR:
                buttonArea = <div>
                    <div className="flex-centered">
                        <button
                            className="button cart-button secondary-button upper-button rounded is-bold raised"
                            onClick={this.onReturnClick}>
                            Return
                        </button>
                    </div>
                    <div className="flex-centered">
                        <div className={this.props.regFormError.all ? '' : 'display-none'}>
                            <div className="reg-form-error">
                                {this.props.regFormError.all}
                            </div>
                        </div>
                    </div>
                </div>;
                break;
            case constants.IMAGE_REG_FORM_STATE_DEFAULT:
                buttonArea = <div>
                    <div className="flex-centered">
                        <button
                            className="button cart-button secondary-button upper-button rounded is-bold raised"
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
                </div>;
                break;
            case constants.IMAGE_REG_FORM_STATE_PREL_FEE_RECEIVED:
                buttonArea = <div>
                    <div className="regfee-msg">Preliminary network
                        fee: {this.props.regFormFee} PSL
                    </div>
                    <div className="flex-centered">
                        <button
                            className="button cart-button secondary-button upper-button rounded is-bold raised"
                            onClick={this.onProceedClick}>
                            Proceed
                        </button>
                    </div>
                </div>;
                break;
            case constants.IMAGE_REG_FORM_STATE_REQUESTING_NETWORK:
                buttonArea = <div>
                    <div className="regfee-msg">Requesting network for the worker's fee
                    </div>
                    <div className="flex-centered">
                        <BarLoader
                            sizeUnit={"%"}
                            width={90}
                            color={'#00D1B2'}
                            loading={true}
                        />
                    </div>
                </div>;
                break;
            case constants.IMAGE_REG_FORM_STATE_WORKER_FEE_RECEIVED:
                buttonArea = <div>
                    <div className="regfee-msg">Worker's fee: {this.props.workerFee} PSL
                    </div>
                    <div className="flex-centered">
                        <button
                            className="button cart-button secondary-button upper-button rounded is-bold raised"
                            onClick={this.onAcceptStep3Click}>
                            Accept
                        </button>
                        <button
                            className="button cart-button secondary-button upper-button rounded is-bold raised"
                            onClick={this.onReturnClick}>
                            Decline
                        </button>
                    </div>
                </div>;
                break;
            case constants.IMAGE_REG_FORM_STATE_SEND_REGTICKET_MN_2_3:
                buttonArea = <div>
                    <div className="regfee-msg">Sending registration ticket to masternodes 2 and 3
                    </div>
                    <div className="flex-centered">
                        <BarLoader
                            sizeUnit={"%"}
                            width={90}
                            color={'#00D1B2'}
                            loading={true}
                        />
                    </div>
                </div>;
                break;
            case constants.IMAGE_REG_FORM_STATE_MN_2_3_RESPONSE_RECEIVED:
                buttonArea = <div>
                    <div className="regfee-msg">Masternodes 2 and 3 accepted image registration
                    </div>
                </div>;
                break;

            default:
                break;
        }
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
                                        {buttonArea}
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