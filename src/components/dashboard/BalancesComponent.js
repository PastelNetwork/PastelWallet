import React from "react";

export const Balances = (props) => {
    return <div className="column is-7">
        <div className="flat-card profile-info-card is-auto">

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
    </div>

};
