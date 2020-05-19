import React, { Component } from 'react';

import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { getBalance, getInfo } from '../../actions';
import {Card} from '../../components/common';
import SendPSL from './SendPSL';
import {Wrapper} from '../../components/common';

class Main extends Component {
  componentDidMount () {
    this.props.dispatch(getBalance());
    if (!this.props.blockchainInfo) {
      this.props.dispatch(getInfo());
    }
  }

  render () {
    return <Wrapper>
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

    </Wrapper>;
  }
}

export default connect(state => ({
  balance: state.blockchain.balance,
  currentPastelID: state.others.currentPastelID,
  artworks: state.blockchain.artworks,
  masternodes: state.blockchain.masternodes,
  blockchainInfo: state.blockchain.blockchainInfo
}), dispatch => ({ dispatch }))(Main);
