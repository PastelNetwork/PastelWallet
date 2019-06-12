import React, {Component} from 'react';
import '../styles.scss';
import '../assets/scss/core.scss';
import '../assets/scss/custom.scss';
import 'bulma/bulma.sass';
import {BalancesContainer} from "../containers/dashboard/BalancesContainer";
import {Profile} from "./dashboard/ProfileComponent";
import {MainWrapper} from "./MainWrapperComponent";
import history from "../history";
import * as Feather from 'react-feather';


const EditPicCard = (props) => {
    return <div className="column is-5">
        <div className="flat-card profile-card is-auto">
            <div className="card-body">
                <div className="profile-image" onClick={this.onImageClick}>
                    <img src="https://i.pravatar.cc/200" alt=""/>
                </div>
                <div className="username has-text-centered">
                    <span>Elie Daniels</span>
                    <small>Member since Sep 23 2017</small>
                </div>
            </div>
        </div>
    </div>
};


export class ProfileEdit extends Component {
    render() {
        return <MainWrapper noLogo>
            <div className="columns is-account-grid is-multiline">
                <div className="column is-4">
                    <div className="flat-card upload-card is-auto">
                        <div className="card-body">
                            <div id="avatar-upload" className="avatar-wrapper has-simple-popover"
                                 data-content="Change profile picture" data-placement="top">
                                <img className="profile-pic" src="http://via.placeholder.com/250x250" alt=""/>
                                <div className="upload-button">
                                    <Feather.Plus className="upload-icon" aria-hidden="true"/>
                                </div>
                                <input className="file-upload" type="file" accept="image/*"/>
                            </div>

                            <div className="username has-text-centered">
                                <span>Elie Daniels</span>
                                <span>eliedaniels@gmail.com</span>
                            </div>

                            <div className="has-text-centered">
                                <button className="button feather-button secondary-button will-upload">
                                    Save picture
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column is-8">
                    <div className="flat-card profile-info-card is-auto">
                        <div className="card-title">
                            <h3>Contact info</h3>
                            <div className="confirm-button">
                                <a href="javascript:void(0);" role="button" className="has-simple-popover"
                                   data-content="Save Contact info" data-placement="top">
                                    <Feather.Check/>
                                </a>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="info-block">
                                        <span className="label-text">First Name</span>
                                        <div className="control">
                                            <input type="text" className="input is-default" value="Elie"/>
                                        </div>
                                    </div>

                                    <div className="info-block">
                                        <span className="label-text">Email</span>
                                        <div className="control">
                                            <input type="email" className="input is-default"
                                                   value="eliedaniels@gmail.com"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="column is-6">
                                    <div className="info-block">
                                        <span className="label-text">Last Name</span>
                                        <div className="control">
                                            <input type="text" className="input is-default" value="Daniels"/>
                                        </div>
                                    </div>

                                    <div className="info-block">
                                        <span className="label-text">Phone</span>
                                        <div className="control">
                                            <input type="text" className="input is-default" value="+1 555 623 568"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>;
    }
}
