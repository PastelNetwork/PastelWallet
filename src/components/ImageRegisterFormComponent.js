import React, {Component} from 'react';
import '../styles.scss';
import {Footer} from "./common/FooterComponent";
import {FlexRow} from "./common/FlexRowComponent";
import {LeftMenu} from "./common/LeftMenuComponent";
import axios from 'axios';
import history from '../history';
import {HeaderContainer} from "../containers/HeaderContainer";

const ipcRenderer = window.require('electron').ipcRenderer;

export class ImageRegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            artName: '',
            numCopies: 0,
            copyPrice: 0,
            publicKey: '',
            privateKey: '',
            filePath: ''
        }
    }

    componentDidMount() {
        document.title = 'Pastel wallet';
    }

    onFormSubmit = () => {
        //TODO: collect all info, put into container
        let data = this.state;
        ipcRenderer.send('imageRegFormSubmit', data);
        history.push('/');
    };
    onAddFile = (e) => {
        let file = e.target.files[0];
        this.setState({file: URL.createObjectURL(file), filePath: file.path});
    };
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };
    render() {
        return <React.Fragment>
            <HeaderContainer/>
            <FlexRow>
                <LeftMenu/>
                <div className="main-page flex-col">
                    <section className="flex-col pt-3 pb-2 wrap">
                        <form>
                            <input type="text" className="image-register-input" placeholder="Art name" name="artName"
                            value={this.state.artName} onChange={this.onChange}/>
                            <input type="number" className="image-register-input" placeholder="Number of copies"
                                   name="numCopies" value={this.state.numCopies}  onChange={this.onChange}/>
                            <input type="number" className="image-register-input" placeholder="Price of the copy, PSL"
                            name="copyPrice" value={this.state.copyPrice}  onChange={this.onChange}/>
                            <textarea className="image-register-input" rows="2"
                                      placeholder="Public Key" name="publicKey" value={this.state.publicKey}
                             onChange={this.onChange}/>

                            <textarea name="privateKey" className="image-register-input" rows="5"
                                      placeholder="Private Key" value={this.state.privateKey} onChange={this.onChange}/>

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
                            <div className="flex-centered">
                                <button className="register-button" onClick={this.onFormSubmit}>Register</button>
                            </div>

                        </form>
                    </section>
                </div>
            </FlexRow>
        </React.Fragment>
    }
}