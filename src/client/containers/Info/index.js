import React, { Component } from 'react';
import { Card, Wrapper } from '../../components/common';
import * as style from './style.module.scss';
import { connect } from 'react-redux';

const mainItems = [
  ['Artworks', x => x.artworks],
  ['Masternodes', x => x.masternodes],
  ['Blocks', x => x.info && x.info.blocks],
  ['Difficulty', x => x.info && x.info.difficulty]
];

class Info extends Component {
  render () {
    console.log(this.props.info);
    return <Wrapper>
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
      </Card>
      <Card className={style.card}>
        <h3>OTHER INFORMATION</h3>
      </Card>
    </Wrapper>;
  }
}

export default connect(state => ({
  artworks: state.blockchain.artworks,
  masternodes: state.blockchain.masternodes,
  info: state.blockchain.blockchainInfo,
  peerInfo: state.blockchain.peerInfo
}))(Info);
