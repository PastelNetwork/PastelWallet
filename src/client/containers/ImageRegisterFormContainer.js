import {connect} from 'react-redux';

import {ImageRegisterForm} from "../components/ImageRegisterFormComponent";

const mapStateToProps = state => ({
    regFormError: state.regFormError,
    artNameError: state.regFormError.artName,
    artFileError: state.regFormError.artFile,
    commonError: state.regFormError.all,
    regFormFee: state.regFormFee,
    workerFee: state.workerFee,
    regFormState: state.regFormState,
    regticketId: state.regticketId,
    txid: state.regFormTxid,
    regFormTxidAct: state.regFormTxidAct,
    imageRegFormMessage: state.imageRegFormMessage
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const ImageRegisterFormContainer = connect(mapStateToProps, mapDispatchToProps)(ImageRegisterForm);
