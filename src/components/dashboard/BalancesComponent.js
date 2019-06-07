import React, {Component} from "react";
import * as Feather from 'react-feather';
import {connect} from "react-redux";

const BalancesCard = (props) => {
    return <div className="flat-card profile-info-card is-auto">

        <div className="card-title">
            <h3>Balances</h3>
        </div>

        <div className="card-body">
            <div className="columns">
                <div className="column balance-col">
                    {props.balance} PSL
                </div>
                <div className="column balance-col">
                    {props.artworks} Artworks
                </div>
                <div className="column balance-col">
                    {props.masternodes} Masternodes
                </div>
            </div>
        </div>
    </div>
};

const BalancesCardContainer = connect(state => ({
    balance: state.balance,
    artworks: state.artworks,
    masternodes: state.masternodes
}), dispatch => ({
    dispatch
}))(BalancesCard);


class AddressCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        }
    }

    render() {
        return <div className="flat-card profile-info-card is-auto">

            <div className="card-title expandable-header" onClick={() =>
                this.setState({collapsed: !this.state.collapsed})
            }>
                <Feather.ChevronsDown/>
                <h3>{this.props.name}</h3>
            </div>

            <div className={'card-body break-all ' + (this.state.collapsed ? 'is-hidden' : '')}>
                {this.props.address}
            </div>
        </div>;
    }
}

export const Balances = (props) => {
    return <div className="column is-7">
        <BalancesCardContainer/>
        <AddressCard name="Wallet address" address={props.address}/>
        <AddressCard name="Pastel ID" address={props.pastelID}/>
    </div>
};
