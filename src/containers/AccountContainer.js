import {connect} from 'react-redux';
import * as ajaxEntities from '../ajaxEntities';
import {Account} from '../components/AccountComponent';

const mapStateToProps = state => ({
    token: state.token,
    userProfile: state.userProfile,
    ajaxInProgress: state.ajaxInProgress[ajaxEntities.USER_PROFILE]
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(Account);
