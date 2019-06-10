import React, {Component} from 'react';
import '../styles.scss';
import {store} from "../app";
import {setImageRegFormError, setImageRegFormRegFee, setRegFee} from "../actions";
import {RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK} from "../constants";
import {MainWrapper} from "./MainWrapperComponent";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('imageRegFormSubmitResponse', (event, data) => {
    // TODO: parse response
    // TODO: set appropriate values in store
    switch (data.status) {
        case RESPONSE_STATUS_ERROR:
            console.log('error');
            store.dispatch(setImageRegFormError(data.msg));
            break;
        case RESPONSE_STATUS_OK:
            console.log('ok');
            store.dispatch(setImageRegFormError(null));
            store.dispatch(setImageRegFormRegFee(data.regFee));
            break;
        default:
            break;
    }
    // store.dispatch(setRegFee(value));
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

    onFormSubmit = (e) => {
        e.preventDefault();
        let data = this.state;
        ipcRenderer.send('imageRegFormSubmit', data);
        // history.push('/');
    };
    onProceedClick = (e) => {
        //TODO: create image registration ticket
        //TODO: calculate image hash
        e.preventDefault();
        let data = this.state;
        ipcRenderer.send('imageRegFormSubmit', data);
        // history.push('/');
    };
    onAddFile = (e) => {
        let file = e.target.files[0];
        this.setState({file: URL.createObjectURL(file), filePath: file.path});
    };
    onChange = (e) => {
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
                                            <input type="file" accept="image/*" placeholder="Taksa" id="idArtFile"
                                                   onChange={this.onAddFile}/>
                                        </div>
                                    </div>

                                    <div className="flex-centered">
                                        <div className={this.props.regFormFee ? 'display-none' : ''}>
                                            <button
                                                className="button
                                            cart-button secondary-button upper-button rounded is-bold raised"
                                                onClick={this.onFormSubmit}>
                                                Register
                                            </button>
                                            <div className="flex-centered">
                                                <div className={this.props.regFormError ? '' : 'display-none'}>
                                                    <div>
                                                        {this.props.regFormError}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={this.props.regFormFee ? '' : 'display-none'}>
                                            <div className="send-psl-status-msg">Registration fee: {this.props.regFormFee} PSL</div>
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