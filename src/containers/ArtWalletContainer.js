import {connect} from 'react-redux';

import {ArtWallet} from "../components/ArtWalletComponent";

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const ArtWalletContainer = connect(mapStateToProps, mapDispatchToProps)(ArtWallet);
