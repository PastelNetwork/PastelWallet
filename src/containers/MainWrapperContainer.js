import {connect} from 'react-redux';

import {MainWrapper} from "../components/MainWrapperComponent";

const mapStateToProps = state => ({
    leftMenuShow: state.leftMenuShow
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const MainWrapperContainer = connect(mapStateToProps, mapDispatchToProps)(MainWrapper);
