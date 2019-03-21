import {connect} from 'react-redux';
import * as ajaxEntities from '../ajaxEntities';
import {EditAccount} from '../components/EditAccountComponent';

const mapStateToProps = state => ({
    token: state.token,
    userProfile: state.userProfile,
    ajaxInProgress: state.ajaxInProgress[ajaxEntities.USER_PROFILE]
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const EditAccountContainer = connect(mapStateToProps, mapDispatchToProps)(EditAccount);
