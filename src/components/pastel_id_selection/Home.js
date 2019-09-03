import React, {Component} from "react";
import {MainWrapper} from "../MainWrapperComponent";
import {BarLoader} from "react-spinners";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('pastelIdListResponse', (event, data) => {
    console.log('pastelIdListResponse received');
    // TODO: redirect to the appropriate page (no keys/no registered keys/choose key/...)
});

const PastelIdCard = (props) => {
    return <div className="flat-card profile-info-card is-auto">

        <div className="card-title">
            <h3>{props.header}</h3>
        </div>

        <div className="card-body">
            {props.children}
            {/*<div className="columns">*/}
            {/*<div className="column balance-col">*/}
            {/*{props.balance} PSL*/}
            {/*</div>*/}
            {/*<div className="column balance-col">*/}
            {/*{props.artworks} Artworks*/}
            {/*</div>*/}
            {/*<div className="column balance-col">*/}
            {/*{props.masternodes} Masternodes*/}
            {/*</div>*/}
            {/*</div>*/}
        </div>
    </div>;
};

export class PastelIdHome extends Component {
    componentDidMount() {
        ipcRenderer.send('pastelIdList', {});
    }

    render() {
        return <MainWrapper>
            <PastelIdCard header={'Fetching pastel IDs...'}>
                <div className="flex-centered">
                    <BarLoader
                        sizeUnit={"%"}
                        width={90}
                        color={'#00D1B2'}
                        loading={true}
                    />
                </div>
            </PastelIdCard>
        </MainWrapper>;
    }
}
