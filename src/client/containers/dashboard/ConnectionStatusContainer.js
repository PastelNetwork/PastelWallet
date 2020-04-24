import {connect} from 'react-redux';

import {ConnectionStatus} from "../../components/ConnectionStatusComponent";

const mapStateToProps = state => ({
    cNodeStatus: state.cNodeStatus,
    pyNodeStatus: state.pyNodeStatus
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const ConnectionStatusContainer = connect(mapStateToProps, mapDispatchToProps)(ConnectionStatus);
