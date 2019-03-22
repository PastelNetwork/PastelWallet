import React, {Component} from 'react';
import * as NephosGrayscale from '../assets/images/logo/nephos-greyscale.svg';
import {Settings} from 'react-feather';
import {fetchUserProfile, userProfileSetEditMode, userProfileSetEditModeAll} from "../actions";
import * as Altvatar from '../assets/images/avatars/altvatar.png';
import {AccountDetailContainer, AccountProfileContainer, BillingAddressContainer} from "../containers/AccountContainer";
import {
    AccountDetailEditContainer,
    AccountProfileEditContainer,
    BillingAddressEditContainer
} from "../containers/EditAccountContainer";

export const AccountProfile = (props) => {
    const fullName = `${props.userProfile.first_name} ${props.userProfile.last_name}`;
    const dateJoined = new Date(props.userProfile.date_joined);
    const profileImage = props.userProfile.picture ? props.userProfile.picture : Altvatar;

    return <div className="flat-card profile-card is-auto">

        <div className="card-body">
            <div className="profile-image">
                <img src={profileImage} alt=""/>
            </div>
            <div className="username has-text-centered">
                <span>{fullName}</span>
                <small>Member since {dateJoined.toLocaleDateString()}</small>
            </div>
        </div>
        <div className="profile-footer has-text-centered">
            <span className="achievement-title">Next Achievement</span>
            <div className="count">
                24/150
            </div>
        </div>
    </div>;
};

export const AccountDetail = (props) => {
    return <div className="flat-card profile-info-card is-auto">

        <div className="card-title">
            <h3>Account details</h3>

            <div className="edit-account has-simple-popover popover-hidden-mobile"
                 data-content="Edit Account" data-placement="top">
                <a onClick={(e) => {
                    props.dispatch(userProfileSetEditModeAll(true))
                }}>
                    <Settings/>
                </a>
            </div>
        </div>

        <div className="card-body">
            <div className="columns">
                <div className="column is-6">
                    <div className="info-block">
                        <span className="label-text">First Name</span>
                        <span
                            className="label-value">{props.userProfile.first_name}</span>
                    </div>

                    <div className="info-block">
                        <span className="label-text">Email</span>
                        <span className="label-value">{props.userProfile.email}</span>
                    </div>
                </div>

                <div className="column is-6">
                    <div className="info-block">
                        <span className="label-text">Last Name</span>
                        <span
                            className="label-value">{props.userProfile.last_name}</span>
                    </div>

                    <div className="info-block">
                        <span className="label-text">Phone</span>
                        <span
                            className="label-value">{props.userProfile.phone_number}</span>
                    </div>
                </div>
            </div>
        </div>

        <img className="card-bg" src={NephosGrayscale} alt=""/>
    </div>
};

export const BillingAddress = (props) => {
    const billingAddress = props.userProfile.billing_address || {};

    return <div className="flat-card profile-info-card is-auto">

        <div className="card-title">
            <h3>Billing address</h3>

        </div>

        <div className="card-body">
            <div className="columns">
                <div className="column is-6">
                    <div className="info-block">
                        <span className="label-text">Number</span>
                        <span className="label-value">{billingAddress.number || ''}</span>
                    </div>

                    <div className="info-block">
                        <span className="label-text">City</span>
                        <span className="label-value">{billingAddress.city || ''}</span>
                    </div>

                    <div className="info-block">
                        <span className="label-text">State</span>
                        <span className="label-value">{billingAddress.state || ''}</span>
                    </div>
                </div>

                <div className="column is-6">
                    <div className="info-block">
                        <span className="label-text">Street</span>
                        <span className="label-value">{billingAddress.street || ''}</span>
                    </div>

                    <div className="info-block">
                        <span className="label-text">Postal Code</span>
                        <span
                            className="label-value">{billingAddress.postal_code || ''}</span>
                    </div>

                    <div className="info-block">
                        <span className="label-text">Country</span>
                        <span className="label-value">{billingAddress.country || ''}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>;
};

export class Account extends Component {
    constructor(props) {
        super(props);
        if (!this.props.userProfile) {
            this.props.dispatch(fetchUserProfile());
        }
    }

    render() {
        if (!this.props.userProfile) {
            return null;
        }
        const profile = this.props.pictureEditMode ?
            <AccountProfileEditContainer/> : <AccountProfileContainer/>;
        const details = this.props.detailsEditMode ? <AccountDetailEditContainer/> : <AccountDetailContainer/>;
        const address = this.props.addressEditMode ?
            <BillingAddressEditContainer/> : <BillingAddressContainer/>;

        return <div className="section">

            <div className="container">


                <div className="columns account-header">
                    <div className="column is-10 is-offset-1 is-tablet-landscape-padded">

                        <div className="account-title">
                            <h2>ACCOUNT</h2>
                            <img className="brand-filigrane" src={NephosGrayscale} alt=""/>
                        </div>


                        <div className="tabs account-tabs">
                            <ul>
                                <li className="is-active"><a href="pastel-account.html">Account</a></li>
                                <li><a href="pastel-wallet.html">Wallet</a></li>
                                <li><a href="pastel-cart.html">Cart</a></li>
                                <li><a href="pastel-verification.html">Verification</a></li>
                            </ul>
                        </div>


                        <div className="columns is-account-grid is-multiline">
                            <div className="column is-5">
                                {profile}
                            </div>

                            <div className="column is-7">
                                {details}

                                {address}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>;
    }
}