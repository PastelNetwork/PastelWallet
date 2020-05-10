import React, { Component } from 'react';
import * as style from './style.module.scss';
import Card from '../Card';
import { Button, Input } from '../../../components/common';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../../ipc/ipc';
import { SET_PSL_SEND_ERROR } from '../../../actionTypes';

class SendPSL extends Component {
  constructor (props) {
    super(props);
    this.state = {
      address: '',
      amount: 0
    };
  }

  onClick = (e) => {
    e.preventDefault();
    let data = this.state;
    ipcRenderer.send('sendPSLRequest', data);
  };

  onChange = (e) => {
    if (this.props.pslSendError) {
      this.props.dispatch({ type: SET_PSL_SEND_ERROR, value: null });
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  render () {
    return <Card style={{ marginBottom: '10px', marginLeft: '10px', width: '100%', paddingRight: '25px' }}
                 className={style.send}>
      <h3>SEND PSL</h3>
      <Input name={'address'} label={'Address'} style={{ width: '100%', lineHeight: '20px' }}
             containerStyle={{ marginTop: '13px' }} onChange={this.onChange}
             value={this.state.address}/>
      <Input name={'amount'} label={'Amount, PSL'} style={{ width: '100%', lineHeight: '20px' }}
             containerStyle={{ marginTop: '8px' }} onChange={this.onChange}
             value={this.state.amount}/>
      <Button style={{ marginTop: '20px', width: '106px' }} onClick={this.onClick}>Send</Button>
      {this.props.pslSendError && <span className={style.error}>{this.props.pslSendError}</span>}
    </Card>;
  }
}

export default connect(state => ({
  pslSendError: state.pslSendError
}), dispatch => ({ dispatch }))(SendPSL);
