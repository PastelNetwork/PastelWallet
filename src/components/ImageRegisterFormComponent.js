import React, {Component} from 'react';
import '../styles.scss';
import {Header} from "./common/HeaderComponent";
import {Footer} from "./common/FooterComponent";
import {FlexRow} from "./common/FlexRowComponent";
import {LeftMenu} from "./common/LeftMenuComponent";
import axios from 'axios';
import history from '../history';

export class ImageRegisterForm extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.state = {
            file: null
        }
    }

    componentDidMount() {
        document.title = 'Pastel wallet';
    }

    onFormSubmit = () => {
        history.push('/');
    };
    render() {
        return <React.Fragment>
            <Header/>
            <FlexRow>
                <LeftMenu/>
                <div className="main-page flex-col">
                    <section className="flex-col pt-3 pb-2 wrap">
                        <form>
                            <input type="text" className="image-register-input" placeholder="Art name"/>
                            <input type="number" className="image-register-input" placeholder="Number of copies"/>
                            <input type="number" className="image-register-input" placeholder="Price of the copy, PSL"/>
                            <textarea name="private key" className="image-register-input" rows="2"
                                      placeholder="Public Key">

                            </textarea>
                            <textarea name="private key" className="image-register-input" rows="5"
                                      placeholder="Private Key">

                            </textarea>
                            <div className="image-register-input">
                                <label htmlFor="idArtFile">Art file</label>
                                <div>
                                <input type="file" placeholder="Taksa" id="idArtFile"/>
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