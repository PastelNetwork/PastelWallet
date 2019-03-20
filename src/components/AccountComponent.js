import React, {Component} from 'react';
import * as NephosGrayscale from '../assets/images/logo/nephos-greyscale.svg';
import { Settings } from 'react-feather';
import {fetchUserProfile} from "../actions";
import * as Altvatar from '../assets/images/avatars/altvatar.png';


export class Account extends Component {
    render() {
        if (!this.props.userProfile) {
            this.props.dispatch(fetchUserProfile());
            return null;
        }
        const fullName = `${this.props.userProfile.first_name} ${this.props.userProfile.last_name}`;
        const dateJoined = new Date(this.props.userProfile.date_joined);
        const profileImage = this.props.userProfile.picture ? this.props.userProfile.picture : Altvatar;
        const billingAddress = this.props.userProfile.billing_address || {};

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
                                
                                <div className="flat-card profile-card is-auto">
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
                                </div>
                            </div>

                            
                            <div className="column is-7">
                                <div className="flat-card profile-info-card is-auto">
                                    
                                    <div className="card-title">
                                        <h3>Account details</h3>

                                        <div className="edit-account has-simple-popover popover-hidden-mobile"
                                             data-content="Edit Account" data-placement="top">
                                            <a href="pastel-account-edit.html">
                                                <Settings/>
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="card-body">
                                        <div className="columns">
                                            <div className="column is-6">
                                                <div className="info-block">
                                                    <span className="label-text">First Name</span>
                                                    <span className="label-value">{this.props.userProfile.first_name}</span>
                                                </div>

                                                <div className="info-block">
                                                    <span className="label-text">Email</span>
                                                    <span className="label-value">{this.props.userProfile.email}</span>
                                                </div>
                                            </div>

                                            <div className="column is-6">
                                                <div className="info-block">
                                                    <span className="label-text">Last Name</span>
                                                    <span className="label-value">{this.props.userProfile.last_name}</span>
                                                </div>

                                                <div className="info-block">
                                                    <span className="label-text">Phone</span>
                                                    <span className="label-value">{this.props.userProfile.phone_number}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <img className="card-bg" src={NephosGrayscale} alt=""/>
                                </div>

                                
                                <div className="flat-card profile-info-card is-auto">
                                    
                                    <div className="card-title">
                                        <h3>Billing address</h3>
                                        
                                        <div className="edit-account is-vhidden">
                                            <a href="pastel-account-edit.html">
                                                <i className="feather-icons" data-feather="settings">

                                            </i>
                                            </a>
                                        </div>

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
                                                    <span className="label-value">{billingAddress.postal_code || ''}</span>
                                                </div>

                                                <div className="info-block">
                                                    <span className="label-text">Country</span>
                                                    <span className="label-value">{billingAddress.country || ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>;
    }
}