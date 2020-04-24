import {connect} from 'react-redux';
import {SendPSL} from "../components/SendPSL";


const mapStateToProps = state => ({
    sendPslStatusData: state.sendPslStatusData
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const SendPSLContainer = connect(mapStateToProps, mapDispatchToProps)(SendPSL);
