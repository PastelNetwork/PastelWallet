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
            <form>
                <input type="text" className="image-register-input" placeholder="Art name" name="artName"
                       value={this.state.artName} onChange={this.onChange}/>
                <input type="number" className="image-register-input" placeholder="Number of copies"
                       name="numCopies" value={this.state.numCopies} onChange={this.onChange}/>
                <input type="number" className="image-register-input" placeholder="Price of the copy, PSL"
                       name="copyPrice" value={this.state.copyPrice} onChange={this.onChange}/>

                <div className="image-register-input">
                    <div className={this.state.file ? '' : 'display-none'}>
                        <div className="flex-row flex-centered">
                            <img src={this.state.file} className="img-preview pb-1" alt=""/>
                        </div>
                    </div>
                    <label htmlFor="idArtFile">Art file</label>
                    <div>
                        <input type="file" accept="image/*" placeholder="Taksa" id="idArtFile"
                               onChange={this.onAddFile}/>
                    </div>
                </div>
                <div className={this.props.regFormFee ? 'display-none' : ''}>
                    <div className="flex-centered">
                        <button className="register-button" onClick={this.onFormSubmit}>Register</button>
                    </div>
                    <div className="flex-centered">
                        <div className={this.props.regFormError ? '' : 'display-none'}>
                            <div>
                                {this.props.regFormError}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={this.props.regFormFee ? '' : 'display-none'}>
                    <div>Registration fee: {this.props.regFormFee}</div>
                    <div className="flex-centered">
                        <button className="register-button" onClick={this.onProceedClick}>Proceed</button>
                    </div>
                </div>

            </form>
        </MainWrapper>;
    }
}