import {connect} from 'react-redux';

import {ImageRegisterForm} from "../components/ImageRegisterFormComponent";

const mapStateToProps = state => ({
    regFormError: state.regFormError,
    regFormFee: state.regFormFee,
    workerFee: state.workerFee,
    regFormState: state.regFormState
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const ImageRegisterFormContainer = connect(mapStateToProps, mapDispatchToProps)(ImageRegisterForm);
