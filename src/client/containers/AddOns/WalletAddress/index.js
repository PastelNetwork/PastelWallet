import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from "react-router-dom";

const WalletAddress = (props) => {
  const { location } = props;

  return <React.Fragment>{location.pathname.startsWith('/pastel_id') && props.balance!==null && <div style={{
    position: 'fixed',
    right: '20px',
    bottom: '51px',
    fontSize: '12px',
    color: 'var(--grey-3)'
  }}>
    Balance <span style={{color: 'var(--text-grey)'}}>{props.balance}</span>
  </div>}
    {props.address && <div style={{
    position: 'fixed',
    right: '20px',
    bottom: '31px',
    fontSize: '12px',
    color: 'var(--grey-3)'
  }}>
    Your wallet address is <span style={{color: 'var(--text-grey)'}}>{props.address}</span>
  </div>}
  </React.Fragment>
};

export default withRouter(connect(state => ({
  address: state.blockchain.blockchainAddress,
  balance: state.blockchain.balance
}))(WalletAddress));
