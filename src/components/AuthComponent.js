import React, {Component} from 'react';
import '../assets/scss/core.scss';
import '../assets/css/bulma.css';
import '../assets/js/webuipopover/jquery.webui-popover.css';
import '../assets/js/izitoast/css/iziToast.min.css';
import '../assets/js/zoom/zoom.css';
import '../assets/js/jpcard/card.css';
import '../assets/css/chosen/chosen.css';
import '../assets/css/icons.min.css'

import * as LogoW from '../assets/images/logo-w.png'
import * as NephosGrayscale from '../assets/images/logo/nephos-greyscale.svg';
import {ShopWrapper} from "./ShopWrapper";
import {LoginContainer} from "../containers/LoginContainer";
import {Register2Container, RegisterContainer} from "../containers/RegisterContainer";

const Tabs = Object.freeze({login: 0, register: 1});

export class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_tab: Tabs.login
        }
    }
    changeTab = (e) => {
        this.setState({selected_tab: Tabs[e.target.name]});
    };

    render() {
        const selectedTab = this.state.selected_tab === Tabs.login ? <LoginContainer/> : <Register2Container/>;
        return <ShopWrapper>
            <div className="section">
                <div className="container">


                    <div className="columns account-header is-auth">
                        <div className="column is-10 is-offset-1 is-tablet-landscape-padded">

                            <div className="auth-title">
                                <h2>LOGIN</h2>
                                <a href="index.html"
                                   className="button feather-button is-small primary-button upper-button raised is-hidden-mobile">
                                    <span>Home</span>
                                </a>
                                <img className="brand-filigrane" src={NephosGrayscale} alt=""/>
                            </div>

                            <div className="flat-card is-auto is-auth-form">
                                <div className="columns is-gapless is-flex-mobile">

                                    <div className="column is-6 is-mobile-padded">

                                        <div className="tabs-wrapper animated-tabs">

                                            <div className="tabs is-form-tabs">
                                                <ul>
                                                    <li className={this.state.selected_tab === Tabs.login ? "is-active": ""}>
                                                        <a name="login" onClick={this.changeTab}>Login</a>
                                                    </li>
                                                    <li className={this.state.selected_tab === Tabs.register ? "is-active": ""}>
                                                        <a name="register" onClick={this.changeTab}>Register</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            {selectedTab}

                                        </div>
                                    </div>


                                    <div className="column is-6 has-text-centered image-column is-padded">
                                        <div className="store-wrapper">
                                            <img src={LogoW} alt=""/>
                                            <div className="title">
                                                Pastel
                                            </div>
                                            <div className="subtitle">Login to your account</div>
                                        </div>
                                        <div className="nephos-overlay">

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </ShopWrapper>;
    }
}
