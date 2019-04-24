import {connect} from 'react-redux';

import {Header} from "../components/common/HeaderComponent";

const mapStateToProps = state => ({
    address: state.blockchainData.address,
    pastelID: state.blockchainData.pastelID
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
