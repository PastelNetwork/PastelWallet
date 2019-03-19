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

export class Auth extends Component {

    render() {
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
                                                    <li className="is-active" data-tab="login"><a>Login</a></li>
                                                    <li data-tab="register"><a>Register</a></li>
                                                </ul>
                                            </div>

                                            <div id="login" className="navtab-content is-active">
                                                <form>

                                                    <div className="control">
                                                        <label className="auth-label">Email*</label>
                                                        <input type="email" className="input" placeholder=""/>
                                                    </div>

                                                    <div className="control">
                                                        <label className="auth-label">Password*</label>
                                                        <input type="password" className="input" placeholder=""/>
                                                    </div>

                                                    <div className="control">
                                                        <label className="checkbox-wrap is-small">
                                                            <input id="house" type="checkbox" className="d-checkbox"
                                                                   checked/>
                                                            <span>

                                                            </span>
                                                            <small>Remember me?</small>
                                                        </label>
                                                    </div>

                                                    <div className="button-wrapper">
                                                        <button type="submit"
                                                                className="button feather-button is-small primary-button upper-button raised">
                                                            <span>Login</span>
                                                        </button>
                                                        <a className="forgotten">Forgot Password ?</a>
                                                    </div>
                                                </form>
                                            </div>

                                            <div id="register" className="navtab-content">
                                                <form>

                                                    <div className="control">
                                                        <label className="auth-label">Email*</label>
                                                        <input type="email" className="input" placeholder=""/>
                                                    </div>

                                                    <div className="control">
                                                        <label className="auth-label">Password*</label>
                                                        <input type="password" className="input" placeholder=""/>
                                                    </div>

                                                    <div className="control">
                                                        <label className="auth-label">Confirm Password*</label>
                                                        <input type="password" className="input" placeholder=""/>
                                                    </div>

                                                    <div className="button-wrapper">
                                                        <button type="submit"
                                                                className="button feather-button is-small primary-button upper-button raised">
                                                            <span>Register</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
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
