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
export const AccountDetailEditContainer = connect((state) => ({
        userProfile: state.userProfile,
        firstName: state.detailsToEdit.firstName,
        lastName: state.detailsToEdit.lastName,
        email: state.detailsToEdit.email,
        phone: state.detailsToEdit.phone
    }),
    mapDispatchToProps)(AccountDetailEdit);
export const BillingAddressEditContainer = connect(mapStateToProps, mapDispatchToProps)(BillingAddressEdit);
