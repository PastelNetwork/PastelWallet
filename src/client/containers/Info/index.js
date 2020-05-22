import React, { Component } from 'react';
import { Card, Wrapper } from '../../components/common';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../ipc/ipc';

const mainItems = [
  ['Artworks', x => x.artworks],
  ['Masternodes', x => x.masternodes],
  ['Blocks', x => x.info && x.info.blocks],
  ['Difficulty', x => x.info && x.info.difficulty]
];
const additionalItems = [
  ['Protocol version', x => x.info && x.info.protocolversion],
  ['Wallet version', x => x.info && x.info.walletversion],
  ['Version', x => x.info && x.info.version],
  ['Time offset', x => x.info && x.info.timeoffset],
  ['Key pool size', x => x.info && x.info.keypoolsize],
  ['Key pool oldest', x => x.info && x.info.keypoololdest],
  ['Relay fee', x => x.info && x.info.relayfee],
  ['Testnet', x => x.info && x.info.testnet],
  ['Pay tx fee', x => x.info && x.info.paytxfee],
  ['Proxy', x => x.info && x.info.proxy],
];

const peerFields = ['addr', 'bytesrecv', 'bytessent', 'conntime', 'id', 'pingtime', 'services', 'startingheight', 'subver', 'synced_blocks'];
const PeerInfo = (props) => {
  const { peer } = props;
  return <li className={style.peer}>
    {peerFields.map(field => <p key={field}><span>{field}</span> {peer[field]}</p>)}
  </li>;
};

class Info extends Component {
  constructor (props) {
    super(props);
    this.state = {
      peersExpanded: false
    };
  }

  componentDidMount () {
    if (!this.props.peerInfo) {
      ipcRenderer.send('getPeerInfoRequest', {});
      ipcRenderer.send('blockchainDataRequest', {});
      ipcRenderer.send('getInfoRequest', {});
    }
  }

  render () {
    const peers = this.state.peersExpanded ? this.props.peerInfo : this.props.peerInfo && this.props.peerInfo.slice(0, 3);
    return <Wrapper>
      <div className={style.scroller}>
        <Card className={style.card}>
          <h3>MAIN INFORMATION</h3>
          <ul style={{ display: 'flex', listStyleType: 'none', marginTop: '20px', justifyContent: 'space-between' }}>
            {mainItems.map((item, idx) =>
              <li key={idx}>
                <h5>{item[0]}</h5>
                <p>{item[1](this.props)}</p>
              </li>
            )}
          </ul>
        </Card>
        <Card className={style.card}>
          <h3>CONNECTIONS</h3>
          <ul style={{
            display: 'flex', listStyleType: 'none', marginTop: '20px', justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            {peers && peers.map((peer, idx) => <PeerInfo peer={peer} key={idx}/>)}
          </ul>
          {!this.state.peersExpanded && this.props.peerInfo && this.props.peerInfo.length > 3 ?
            <div className={style['show-all']} onClick={() => this.setState({ peersExpanded: true })}>Show
              all {this.props.peerInfo.length}</div> : null}
          {this.state.peersExpanded ? <div className={style['show-all']}
                                           onClick={() => this.setState({ peersExpanded: false })}>Hide</div> : null}
        </Card>
        <Card className={style.card}>
          <h3>OTHER INFORMATION</h3>
          <ul style={{ display: 'flex', listStyleType: 'none', marginTop: '20px', justifyContent: 'space-between' }}>
            {additionalItems.map((item, idx) =>
              <li key={idx}>
                <h5>{item[0]}</h5>
                <p>{item[1](this.props)}</p>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </Wrapper>;
  }
}

export default connect(state => ({
  artworks: state.blockchain.artworks,
  masternodes: state.blockchain.masternodes,
  info: state.blockchain.blockchainInfo,
  peerInfo: state.blockchain.peerInfo
}))(Info);
