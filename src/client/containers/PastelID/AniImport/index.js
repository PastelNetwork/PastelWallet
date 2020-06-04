import React, { Component } from 'react';
import * as style from './style.module.scss';
import history from '../../../history';
import Wrapper from '../Wrapper';
import { Button, Divider, Input } from '../../../components/common';
import { ipcRenderer } from '../../../ipc/ipc';
import { connect } from 'react-redux';
import * as actionTypes from '../../../actionTypes';

class AniImport extends Component {
  constructor (props) {
    super(props);
    this.state = {
      aniKey: ''
    };
  }

  onClick = () => {
    ipcRenderer.send('aniImport', { key: this.state.aniKey });
  };
  onChange = (e) => {
    this.setState({ aniKey: e.target.value });
    this.resetErrors();
  };
  resetErrors = () => {
    this.props.error && this.props.dispatch({type: actionTypes.SET_ANI_KEY_ERROR, value: null});
    this.props.msg && this.props.dispatch({type: actionTypes.SET_ANI_KEY_MSG, value: null});
  };
  render () {
    const error = this.props.error ? <div className={style['error-msg']}>{this.props.error}</div> : null;
    const msg = this.props.msg ? <div className={style.msg}>{this.props.msg}</div> : null;
    return <Wrapper>
      <div className={style.text}>
        <span style={{ color: 'var(--green)', cursor: 'pointer' }}
              onClick={() => {
                history.push('/pastel_id/select');
                this.resetErrors();
              }}> Back</span>
      </div>
      <Divider style={{ marginTop: '11px' }}/>
      <div className={style.text} style={{ marginTop: '16px' }}>
        Import <b>ANI key</b>
      </div>
      <Input name={'aniKey'} label={'ANI key'} style={{ width: '100%' }} containerStyle={{ marginTop: '8px' }}
             value={this.state.aniKey} onChange={this.onChange}
      />
      {error}
      {msg}
      <Button style={{ width: '100%', marginTop: '15px' }} onClick={this.onClick}
              disabled={this.state.aniKey.length < 52}>Import ANI key</Button>
    </Wrapper>;
  }
}

export default connect(state => ({
  error: state.pastelid.aniKeyError,
  msg: state.pastelid.aniKeyMsg
}))(AniImport);
