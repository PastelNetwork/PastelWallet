import {connect} from 'react-redux';

import {Balances} from "../../components/dashboard/BalancesComponent";

const mapStateToProps = state => ({
    balance: state.balance,
    artworks: state.artworks,
    masternodes: state.masternodes
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const BalancesContainer = connect(mapStateToProps, mapDispatchToProps)(Balances);
