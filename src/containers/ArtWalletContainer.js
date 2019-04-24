import {connect} from 'react-redux';

import {ArtWallet} from "../components/ArtWalletComponent";

const mapStateToProps = state => ({
    address: state.blockchainData.address,
    pastelID: state.blockchainData.pastelID
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const ArtWalletContainer = connect(mapStateToProps, mapDispatchToProps)(ArtWallet);
