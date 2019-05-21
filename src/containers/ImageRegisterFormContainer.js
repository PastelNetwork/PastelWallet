import {connect} from 'react-redux';

import {ImageRegisterForm} from "../components/ImageRegisterFormComponent";

const mapStateToProps = state => ({
    regFormError: state.regFormError,
    regFormFee: state.regFormFee,
    leftMenuShow: state.leftMenuShow
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const ImageRegisterFormContainer = connect(mapStateToProps, mapDispatchToProps)(ImageRegisterForm);
