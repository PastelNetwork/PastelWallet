import React, { Component } from 'react';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { Card, Wrapper, Button } from '../../../components/common';
import { BTN_TYPE_GREEN } from '../../../components/common/constants';
import * as actionTypes from '../../../actionTypes';
import history from '../../../history';

class Success extends Component {
  componentWillUnmount () {
    this.props.dispatch({type: actionTypes.RESET_REGISTRATION});
  };

  onClick = () => {
    this.props.dispatch({type: actionTypes.RESET_REGISTRATION});
    history.push('/register');
  };
  render () {
    return <Wrapper>
      <Card style={{ width: '100%' }} className={style.success}>
        <h3>REGISTER IMAGE</h3>
        <div className={style.wrapper}>
          <img src={this.props.base64File} alt=""/>
          <div>
            <h4>{this.props.artworkName}</h4>
            <h5>Activation ticket was created. TXID: </h5>
            <p>{this.props.actTxid}</p>
          </div>
        </div>
      </Card>
      <div className={style.bottom}>
        <p>Artwork will appear in the network when current block will be mined</p>
        <Button btnType={BTN_TYPE_GREEN} style={{width: '207px'}}
        onClick={this.onClick}>Register another image</Button>

      </div>
    </Wrapper>;
  }
}

export default connect(state => ({
  actTxid: state.registration.regFormTxidAct,
  artworkName: state.registration.artworkName,
  base64File: state.registration.base64File
}))(Success);
