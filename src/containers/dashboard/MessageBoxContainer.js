import {connect} from 'react-redux';

import {MessageBox} from "../../components/dashboard/MessageBoxComponent";

const mapStateToProps = state => ({
    messages: state.userDisplayMessages,
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const MessageBoxContainer = connect(mapStateToProps, mapDispatchToProps)(MessageBox);
