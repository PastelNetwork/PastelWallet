import {connect} from 'react-redux';

import {Header} from "../components/common/HeaderComponent";

const mapStateToProps = state => ({
    address: state.address
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
