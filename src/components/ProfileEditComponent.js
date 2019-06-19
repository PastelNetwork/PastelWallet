import React, {Component} from 'react';
import '../styles.scss';
import '../assets/scss/core.scss';
import '../assets/scss/custom.scss';
import 'bulma/bulma.sass';
import {MainWrapper} from "./MainWrapperComponent";
import * as Feather from 'react-feather';
import axios from 'axios';
import * as settings from '../settings';
import {connect} from "react-redux";
import * as md5 from 'md5';
import {setUserProfile} from "../actions";

class EditPicCardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
        this.fileInputRef = React.createRef();
    }

    componentWillMount() {
        if (this.props.userProfile) {
            this.setState({
                file: this.props.userProfile.picture ? this.props.userProfile.picture: '',
            })
        }
    }

    onChangeFile = (e) => {
        if (e.target.files.length) {
            let file = e.target.files[0];
            this.setState({file: URL.createObjectURL(file)});
        }
    };

    fileAddClick = (e) => {
        this.fileInputRef.current.click();
    };

    savePicture = (e) => {
        let reader = new FileReader();
        const file = this.fileInputRef.current.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64data = reader.result;
            let data = {
                picture_hash: md5(base64data)
            };
            axios.post(settings.SIGN_RESOURCE_URL, data).then((resp) => {
                data.signature = resp.data.signature;
                data.pastel_id = resp.data.pastel_id;
                data.picture = base64data;
                axios.patch(settings.USER_PROFILE_URL,
                    data).then((resp) => {
                    this.props.dispatch(setUserProfile(resp.data));
                }).catch((err) => {
                    // TODO: prettify error displaying.
                    // TODO: But do not silent the error
                    alert(JSON.stringify(err.response.data));
                });
            }).catch((err) => {
                console.log('Error accessing local API');
            });
        };
    };

    render() {
        return <div className="flat-card upload-card is-auto">
            <div className="card-body">
                <div id="avatar-upload" className="avatar-wrapper has-simple-popover"
                     data-content="Change profile picture" data-placement="top">
                    <img className="profile-pic" src={this.state.file} alt=""/>
                    <div className="upload-button" onClick={this.fileAddClick}>
                        <Feather.Plus className="upload-icon" aria-hidden="true"/>
                    </div>
                    <input className="file-upload" type="file" accept="image/*" onChange={this.onChangeFile}
                           ref={this.fileInputRef}/>
                </div>

                <div className="username has-text-centered">
                    <span>Elie Daniels</span>
                    <span>eliedaniels@gmail.com</span>
                </div>

                <div className="has-text-centered">
                    <button className="button feather-button secondary-button will-upload" onClick={this.savePicture}>
                        Save picture
                    </button>
                </div>
            </div>
        </div>
    }
}

export const EditPicCard = connect(state => ({
    pastelID: state.blockchainData.pastelID,
    userProfile: state.userProfile
}), dispatch => ({
    dispatch
}))(EditPicCardComponent);

class EditInfoCardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phone: '',
            email: ''
        }
    }

    componentWillMount() {
        if (this.props.userProfile) {
            this.setState({
                firstName: this.props.userProfile.first_name ? this.props.userProfile.first_name: '',
                lastName: this.props.userProfile.last_name ? this.props.userProfile.last_name: '',
                phone: this.props.userProfile.phone ? this.props.userProfile.phone: '',
                email: this.props.userProfile.email ? this.props.userProfile.email: ''
            })
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    saveInfo = (e) => {
        let data = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            phone_number: this.state.phone,
            email: this.state.email
        };

        axios.post(settings.SIGN_RESOURCE_URL, data).then((resp) => {
            data.signature = resp.data.signature;
            data.pastel_id = resp.data.pastel_id;
            axios.patch(settings.USER_PROFILE_URL,
                data).then((resp) => {
                this.props.dispatch(setUserProfile(resp.data));
            }).catch((err) => {
                // TODO: prettify error displaying.
                // TODO: But do not silent the error
                alert(JSON.stringify(err.response.data));
            });
        }).catch((err) => {
            console.log('Error accessing local API');
        });
    };

    render() {
        return <div className="flat-card profile-info-card is-auto">
            <div className="card-title">
                <h3>Contact info</h3>
                <div className="confirm-button">
                    <a href="javascript:void(0);" role="button" className="has-simple-popover"
                       data-content="Save Contact info" data-placement="top" onClick={this.saveInfo}>
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
                                <input type="text" className="input is-default" value={this.state.firstName}
                                       onChange={this.onChange} name="firstName"/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">Email</span>
                            <div className="control">
                                <input type="email" className="input is-default"
                                       value={this.state.email}
                                       onChange={this.onChange} name="email"/>
                            </div>
                        </div>
                    </div>

                    <div className="column is-6">
                        <div className="info-block">
                            <span className="label-text">Last Name</span>
                            <div className="control">
                                <input type="text" className="input is-default" value={this.state.lastName}
                                       onChange={this.onChange} name="lastName"/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">Phone</span>
                            <div className="control">
                                <input type="text" className="input is-default" value={this.state.phone}
                                       onChange={this.onChange} name="phone"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}


export const EditInfoCard = connect(state => ({
    pastelID: state.blockchainData.pastelID,
    userProfile: state.userProfile
}), dispatch => ({
    dispatch
}))(EditInfoCardComponent);

export class ProfileEdit extends Component {
    render() {
        return <MainWrapper noLogo>
            <div className="columns is-account-grid is-multiline">
                <div className="column is-4">
                    <EditPicCard/>
                </div>

                <div className="column is-8">
                    <EditInfoCard/>
                </div>
            </div>
        </MainWrapper>;
    }
}
