import {connect} from 'react-redux';
import {SendPSL} from "../components/SendPSL";


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const SendPSLContainer = connect(mapStateToProps, mapDispatchToProps)(SendPSL);
