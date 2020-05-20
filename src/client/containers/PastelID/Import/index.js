import React, {Component} from 'react';
import * as style from './style.module.scss';
import Wrapper from '../Wrapper';
import history from '../../../history';
import { ipcRenderer } from '../../../ipc/ipc';
import * as actionTypes from '../../../actionTypes';
import { Button, Divider, Input } from '../../../components/common';
import { BTN_TYPE_LIGHT_BLUE } from '../../../components/common/constants';
import { connect } from 'react-redux';
import { setPasteIDError } from '../../../actions';

class Import extends Component {
  constructor (props) {
    super(props);
    this.state = {
      passphrase: '',
      pastelid: ''
    };
  }
  resetErrors = () => {
    this.props.error && this.props.dispatch(setPasteIDError(null));
    this.props.msg && this.props.dispatch({
      type: actionTypes.SET_PASTEL_ID_MSG,
      value: null
    });
  };

  importAndRegister = () => {
    ipcRenderer.send('pastelIdImportAndRegister', {
      passphrase: this.state.passphrase,
      key: this.state.pastelid,
      blockchainAddress: this.props.blockchainAddress
    });
  };
  importNoRegisterClick = () => {
    ipcRenderer.send('pastelIdImport', { passphrase: this.state.passphrase, key: this.state.pastelid });
  };
  onPassphraseChange = (e) => {
    this.setState({passphrase: e.target.value});
    this.props.dispatch({type: actionTypes.SET_PASTEL_ID_ERROR, value: null});
  };
  onPastelidChange = (e) => {
    this.setState({pastelid: e.target.value});
    this.props.dispatch({type: actionTypes.SET_PASTEL_ID_ERROR, value: null});
  };
  render () {
    const error = this.props.error ? <div className={style['error-msg']}>{this.props.error.message}</div> :null;
    return <Wrapper>
      <div className={style.text}>
        If you have <b>Pastel ID,</b> <span style={{ color: 'var(--green)', cursor: 'pointer' }}
                                            onClick={() => {
                                              history.push('/pastel_id/select');
                                              this.resetErrors();
                                            }}>choose</span> one of them
      </div>
      <Divider style={{ marginTop: '21px' }}/>
      <div className={style.text} style={{ marginTop: '16px' }}>
        Import <b>Pastel ID</b>
      </div>
      <Input name={'pastelid'} label={'Pastel ID'} style={{ width: '100%' }} containerStyle={{ marginTop: '8px' }}
             value={this.state.pastelid} onChange={this.onPastelidChange}
      />
      <Input name={'passphrase'} label={'Passphrase'} style={{ width: '100%' }} containerStyle={{ marginTop: '3px' }}
             value={this.state.passphrase} onChange={this.onPassphraseChange}
      />
      {error}
      <Button style={{ width: '100%', marginTop: '15px' }} disabled={this.state.passphrase === ''} onClick={this.importAndRegister}>Import and
        register</Button>
      <Button btnType={BTN_TYPE_LIGHT_BLUE} style={{ width: '100%', marginTop: '7px' }}
              disabled={this.state.passphrase === ''} onClick={this.importNoRegisterClick}>Import without registration</Button>
    </Wrapper>;
  }
}

export default connect(state => ({
  blockchainAddress: state.blockchain.blockchainAddress,
  error: state.pastelid.pastelIDError,
  msg: state.pastelid.pastelIDMsg
}))(Import);
