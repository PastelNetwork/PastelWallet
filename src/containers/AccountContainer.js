import {connect} from 'react-redux';
import * as ajaxEntities from '../ajaxEntities';
import {Account, AccountDetail, AccountProfile, BillingAddress} from '../components/AccountComponent';

const mapStateToProps = state => ({
    token: state.token,
    userProfile: state.userProfile,
    ajaxInProgress: state.ajaxInProgress[ajaxEntities.USER_PROFILE]
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(Account);
export const AccountProfileContainer = connect(
    (state) => ({userProfile: state.userProfile}),
    mapDispatchToProps
)(AccountProfile);

export const AccountDetailContainer = connect(
    (state) => ({userProfile: state.userProfile}),
    mapDispatchToProps
)(AccountDetail);

export const BillingAddressContainer = connect(
    (state) => ({userProfile: state.userProfile}),
    mapDispatchToProps
)(BillingAddress);
