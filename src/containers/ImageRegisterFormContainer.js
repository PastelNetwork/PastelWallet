import {connect} from 'react-redux';

import {ImageRegisterForm} from "../components/ImageRegisterFormComponent";

const mapStateToProps = state => ({
    regFormError: state.regFormError,
    regFormFee: state.regFormFee
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const ImageRegisterFormContainer = connect(mapStateToProps, mapDispatchToProps)(ImageRegisterForm);
