import React, {Component} from 'react';
import * as NephosGrayscale from '../assets/images/logo/nephos-greyscale.svg';
import {Plus, Check} from 'react-feather';
import Select from 'react-select'
import {
    bulkUpdateUserProfileDetailsToEdit,
    fetchUserProfile,
    pushUserProfileDetails,
    saveUserProfile,
    updateUserProfileDetailsToEdit,
    userProfileSetEditMode
} from "../actions";
import * as Altvatar from '../assets/images/avatars/altvatar.png';
import {COUNTRIES} from "../countries";
import {defaultDetailsToEdit} from "../app";

export class AccountProfileEdit extends Component {
    saveClick = () => {
        // TODO: check if data was changed, if yes - save to BE
        this.props.dispatch(userProfileSetEditMode('picture', false));
    };

    render() {
        return <div className="flat-card upload-card is-auto">
            <div className="card-body">

                <div id="avatar-upload" className="avatar-wrapper has-simple-popover"
                     data-content="Change profile picture" data-placement="top">
                    <img className="profile-pic" src="http://via.placeholder.com/250x250" alt=""/>
                    <div className="upload-button">
                        <Plus/>

                    </div>
                    <input className="file-upload" type="file" accept="image/*"/>
                </div>

                <div className="username has-text-centered">
                    <span>Elie Daniels</span>
                    <span>eliedaniels@gmail.com</span>
                </div>

                <div className="has-text-centered">
                    <button className="button feather-button secondary-button will-upload" onClick={this.saveClick}>
                        Save picture
                    </button>
                </div>
            </div>
        </div>;
    };
}

export class AccountDetailEdit extends Component {
    constructor(props) {
        super(props);
    }

    isChanged = () => {
        return this.props.userProfile.first_name !== this.props.firstName ||
            this.props.userProfile.last_name !== this.props.lastName ||
            this.props.userProfile.email !== this.props.email ||
            this.props.userProfile.phone_number !== this.props.phone;
    };

    saveClick = () => {
        if (this.isChanged()) {
            this.props.dispatch(pushUserProfileDetails());
        } else {
            dispatch(bulkUpdateUserProfileDetailsToEdit(defaultDetailsToEdit));
        }

        this.props.dispatch(userProfileSetEditMode('details', false));
    };
    onChange = (e) => {
        this.props.dispatch(updateUserProfileDetailsToEdit(e.target.name, e.target.value))
    };

    render() {
        return <div className="flat-card profile-info-card is-auto">

            <div className="card-title">
                <h3>Contact info</h3>

                <div className="confirm-button">
                    <a onClick={this.saveClick} role="button" className="has-simple-popover"
                       data-content="Save Contact info" data-placement="top">
                        <Check/>
                    </a>
                </div>
            </div>
            <div className="card-body">
                <div className="columns">
                    <div className="column is-6">
                        <div className="info-block">
                            <span className="label-text">First Name</span>
                            <div className="control">
                                <input type="text" className="input is-default" name="firstName"
                                       value={this.props.firstName}
                                       onChange={this.onChange}/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">Email</span>
                            <div className="control">
                                <input type="email" className="input is-default" value={this.props.email}
                                       name="email" onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>

                    <div className="column is-6">
                        <div className="info-block">
                            <span className="label-text">Last Name</span>
                            <div className="control">
                                <input type="text" className="input is-default" value={this.props.lastName}
                                       name="lastName" onChange={this.onChange}/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">Phone</span>
                            <div className="control">
                                <input type="text" className="input is-default" value={this.props.phone}
                                       name="phone" onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    };
}

export class BillingAddressEdit extends Component {
    selectOnChange = (v) => {
        // v.value
    };
    saveClick = () => {
        // TODO: check if data was changed, if yes - save to BE
        this.props.dispatch(userProfileSetEditMode('billingAddress', false));
    };

    render() {
        const countyChoices = COUNTRIES.map(country => ({value: country, label: country}));
        return <div className="flat-card profile-info-card is-auto has-overflow">

            <div className="card-title">
                <h3>Billing Address</h3>

                <div className="confirm-button">
                    <a onClick={this.saveClick} role="button" className="has-simple-popover"
                       data-content="Save Addresses"
                       data-placement="top">
                        <Check/>
                    </a>
                </div>
            </div>
            <div className="card-body">
                <div className="columns">
                    <div className="column is-6">

                        <div className="info-block">
                            <span className="label-text">Number</span>
                            <div className="control">
                                <input type="text" className="input is-default" value="23, Block C2"/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">City</span>
                            <div className="control">
                                <input type="text" className="input is-default" value="Los Angeles"/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">State</span>
                            <div className="control">
                                <input type="text" className="input is-default" value="CA"/>
                            </div>
                        </div>
                    </div>

                    <div className="column is-6">

                        <div className="info-block">
                            <span className="label-text">Street</span>
                            <div className="control">
                                <input type="text" className="input is-default" value="Church Street"/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">Postal Code</span>
                            <div className="control">
                                <input type="text" className="input is-default" value="100065"/>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="label-text">Country</span>
                            <Select options={countyChoices} onChange={this.selectOnChange}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    };
}