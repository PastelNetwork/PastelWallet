import {connect} from 'react-redux';
import * as ajaxEntities from '../ajaxEntities';
import {
    AccountDetailEdit,
    AccountProfileEdit,
    BillingAddressEdit,
    EditAccount
} from '../components/EditAccountComponent';

const mapStateToProps = state => ({
    token: state.token,
    userProfile: state.userProfile,
    ajaxInProgress: state.ajaxInProgress[ajaxEntities.USER_PROFILE]
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const AccountProfileEditContainer = connect(mapStateToProps, mapDispatchToProps)(AccountProfileEdit);
export const AccountDetailEditContainer = connect(mapStateToProps, mapDispatchToProps)(AccountDetailEdit);
export const BillingAddressEditContainer = connect(mapStateToProps, mapDispatchToProps)(BillingAddressEdit);
