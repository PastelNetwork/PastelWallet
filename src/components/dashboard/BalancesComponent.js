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
            collapsed: true,
            showCopyIcon: false
        };
        this.addressRef = React.createRef();
    }

    mouseOver = (e) => {
        this.setState({showCopyIcon: true});
    };
    onCopyClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.addressRef.current.select();
        document.execCommand('copy');
    };

    render() {
        return <div className="flat-card profile-info-card is-auto">

            <div className="card-title expandable-header" onClick={() =>
                this.setState({collapsed: !this.state.collapsed})
            }>
                <div className="flex-row space-between full-width">
                    <div className="flex-row">
                        <Feather.ChevronsDown/>
                        <h3>{this.props.name}</h3>
                    </div>
                    <div onClick={this.onCopyClick} ref={this.copyRef}>

                        <Feather.Copy className="copy"/>
                    </div>
                </div>
            </div>
            <textarea className="hidden-text-area" value={this.props.address ? this.props.address : ''}
                      ref={this.addressRef} readOnly={true}/>

            <div className={'card-body break-all ' + (this.state.collapsed ? 'is-hidden' : '')}
                 onMouseOver={this.mouseOver}>
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
