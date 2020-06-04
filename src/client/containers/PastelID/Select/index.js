import React, { Component } from 'react';

import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../../ipc/ipc';
import { Button, Divider, Input, Dropdown, Spinner } from '../../../components/common';
import * as actionTypes from '../../../actionTypes';
import history from '../../../history';

import {
  PASTELID_REG_STATUS_IN_PROGRESS,
  PASTELID_REG_STATUS_NON_REGISTERED,
  PASTELID_REG_STATUS_REGISTERED
} from '../../../constants';
import { BTN_TYPE_GREEN } from '../../../components/common/constants';
import { setPasteIDError } from '../../../actions';
import Wrapper from '../Wrapper';

const regStatusVerbose = {
  [PASTELID_REG_STATUS_REGISTERED]: <span style={{ color: 'var(--success)' }}>(registered)</span>,
  [PASTELID_REG_STATUS_IN_PROGRESS]: <span style={{ color: 'var(--pending)' }}>(pending)</span>,
  [PASTELID_REG_STATUS_NON_REGISTERED]: <span style={{ color: 'var(--error)' }}>(not registered)</span>
};

class PastelIDSelect extends Component {
  componentDidMount () {
    if (!this.props.pastelIDs) {
      ipcRenderer.send('pastelIdList', {});
    }
  }
  resetErrors = () => {
    this.props.error && this.props.dispatch(setPasteIDError(null));
    this.props.msg && this.props.dispatch({
      type: actionTypes.SET_PASTEL_ID_MSG,
      value: null
    });
  };
  onChange = (selectedOption) => {
    this.props.dispatch({
      type: actionTypes.SET_SELECTED_PASTEL_ID,
      value: selectedOption
    });
    this.resetErrors();
  };

  onProceedClick = () => {
    ipcRenderer.send('pastelIdCheckPassphrase', {
      pastelID: this.props.selectedPastelId.value,
      passphrase: this.props.passphrase
    });
    this.props.dispatch({
      type: actionTypes.SET_SELECTED_PASSPHRASE,
      value: ''
    });
  };
  onRegisterClick = () => {
    ipcRenderer.send('pastelIdRegister', {
      pastelID: this.props.selectedPastelId.value,
      passphrase: this.props.passphrase,
      blockchainAddress: this.props.blockchainAddress
    });
  };
  onPassphraseChange = (e) => {
    this.props.dispatch({
      type: actionTypes.SET_SELECTED_PASSPHRASE,
      value: e.target.value
    });
    this.resetErrors();
  };

  render () {
    const proceedButton = (disabled, marginTop) => {
      return <Button btnType={BTN_TYPE_GREEN}
                     style={{ width: '100%', marginTop: marginTop }}
                     disabled={disabled}
                     onClick={this.onProceedClick}
      >
        Proceed
      </Button>;
    };

    const pastelIDsOptions = this.props.pastelIDs && this.props.pastelIDs.map(x => ({
      value: x.PastelID,
      label: <React.Fragment>{x.PastelID.substr(0, 10)} {regStatusVerbose[x.regStatus]}</React.Fragment>,
      regStatus: x.regStatus
    }));
    const passphraseInput = <Input style={{ width: '100%', marginTop: '44px' }} placeholder={'Passphrase'}
                                   value={this.props.passphrase}
                                   onChange={this.onPassphraseChange}
    />;

    let input;
    let button;
    let inProgress;
    let error = this.props.error ?
      <div className={style['error-msg']}
           style={!this.props.selectedPastelId && {marginTop: '52px'}}>{this.props.error.message}</div> : null;
    let msg = this.props.msg ?
      <div className={style.msg}>{this.props.msg}</div> : null;
    if (!this.props.selectedPastelId) {
      // no passphrase field, proceed btn inactive
      const marginTop = msg || error ? '20px' : '52px';
      button = proceedButton(true, marginTop);

    } else if (this.props.selectedPastelId.regStatus === PASTELID_REG_STATUS_REGISTERED) {
      // add passphrase field, proceed btn active
      input = passphraseInput;
      button = proceedButton(!this.props.passphrase, '15px');
    } else if (this.props.selectedPastelId.regStatus === PASTELID_REG_STATUS_IN_PROGRESS) {
      // msg, spinner, proceed button inactive
      inProgress = <div className={style['in-progress-msg']}>Your Pastel ID is being registered
        <Spinner style={{ marginRight: '15px', float: 'right' }}/>
      </div>;
      button = proceedButton(true, '5px');
    } else if (this.props.selectedPastelId.regStatus === PASTELID_REG_STATUS_NON_REGISTERED) {
      // add passphrase field, register button
      input = passphraseInput;
      button = <Button btnType={BTN_TYPE_GREEN}
                       style={{ width: '100%', marginTop: '15px' }}
                       disabled={!this.props.passphrase} onClick={this.onRegisterClick}>
        Register
      </Button>;
    }

    return <Wrapper>
        <div className={style.text} style={{ marginBottom: '8px' }}>Please choose which <b>PastelID</b> to use</div>
        <Dropdown onChange={this.onChange}
                  value={this.props.selectedPastelId}
                  options={pastelIDsOptions}
                  placeholder={'Pastel ID'}/>
        {input}
        {inProgress}
        {error}
        {msg}
        {button}
        <Divider style={{ marginTop: '25px' }}/>
        <div className={style.text} style={{ marginTop: '16px' }}>If you do not have <b>Pastel ID</b> you can</div>
        <div className={style['btn-block']}>
          <Button style={{ width: '43%' }} onClick={() => {history.push('/pastel_id/create'); this.resetErrors()}}>Create new</Button>
          or
          <Button style={{ width: '43%' }} onClick={() => {history.push('/pastel_id/import'); this.resetErrors()}}>Import existing</Button>
        </div>
        <div className={style['ani-link']} onClick={() => {history.push('/pastel_id/ani_import'); this.resetErrors()}}>
          Import ANI key
        </div>
    </Wrapper>;
  }
}

const stateToProps = state => (
  {
    pastelIDs: state.pastelid.pastelIDs,
    blockchainAddress: state.blockchain.blockchainAddress,
    error: state.pastelid.pastelIDError,
    msg: state.pastelid.pastelIDMsg,
    selectedPastelId: state.pastelid.selectedPastelId,
    passphrase: state.pastelid.passphrase
  }
);

export default connect(stateToProps)(PastelIDSelect)
