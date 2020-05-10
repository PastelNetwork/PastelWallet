import React, { Component } from 'react';

import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { getBalance, getInfo } from '../../actions';
import { Input, Button } from '../../components/common';
import Card from './Card';
import SendPSL from './SendPSL';

class Main extends Component {
  componentDidMount () {
    this.props.dispatch(getBalance());
    if (!this.props.blockchainInfo) {
      this.props.dispatch(getInfo());
    }
  }

  render () {
    return <div className={style.wrapper}>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Card style={{ marginBottom: '10px', width: '221px', height: '108px' }} className={style.balance}>
            <h3>YOUR <br/>BALANCE</h3>
            <span>{this.props.balance} PSL</span>
          </Card>
          <Card style={{ marginBottom: '10px', width: '221px', height: '108px' }} className={style.pastelid}>
            <h3>PASTEL ID</h3>
            <span>{this.props.currentPastelID}</span>

          </Card>
        </div>
        <SendPSL/>
      </div>
      <Card className={style.info}>
        <h3>NETWORK INFORMATION</h3>
        <ul>
          <li>
            <div>Artworks</div>
            <div>{this.props.artworks}</div>
          </li>
          <li>
            <div>Masternodes</div>
            <div>{this.props.masternodes}</div>
          </li>
          <li>
            <div>Blocks</div>
            <div>{this.props.blockchainInfo && this.props.blockchainInfo.blocks}</div>
          </li>
          <li>
            <div>Difficulty</div>
            <div>{this.props.blockchainInfo && this.props.blockchainInfo.difficulty}</div>
          </li>
        </ul>
      </Card>

    </div>;
  }
}

export default connect(state => ({
  balance: state.balance,
  currentPastelID: state.currentPastelID,
  artworks: state.artworks,
  masternodes: state.masternodes,
  blockchainInfo: state.blockchainInfo
}), dispatch => ({ dispatch }))(Main);
