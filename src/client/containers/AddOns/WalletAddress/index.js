import React from 'react';
import { connect } from 'react-redux';

const WalletAddress = (props) => {
  return props.address && <div style={{
    position: 'fixed',
    right: '20px',
    bottom: '31px',
    fontSize: '12px',
    color: 'var(--grey-3)'
  }}>
    Your wallet address is <span style={{color: 'var(--text-grey)'}}>{props.address}</span>
  </div>
};

export default connect(state => ({address: state.others.blockchainAddress}))(WalletAddress)
