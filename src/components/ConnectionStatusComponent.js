import React, {Component} from 'react';
import {
    CNODE_STATUS_CONNECTED,
    CNODE_STATUS_DISCONNECTED,
    CNODE_STATUS_PENDING,
    PYNODE_STATUS_CONNECTED, PYNODE_STATUS_DISCONNECTED, PYNODE_STATUS_PENDING
} from "../constants";
import {store} from "../app";
import {
    setCNodeStatus,
    setPynodeStatus
} from "../actions";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('updateCNodeStatus', (event, data) => {
    store.dispatch(setCNodeStatus(data.status));
});

ipcRenderer.on('updatePynodeStatus', (event, data) => {
    store.dispatch(setPynodeStatus(data.status));
});

export class ConnectionStatus extends Component {
    render() {
        let cNodeStatus;
        let pyNodeStatus;
        switch (this.props.cNodeStatus) {
            case CNODE_STATUS_CONNECTED:
                cNodeStatus = <div className="conn-status-cnode connected">cNode connected</div>;
                break;
            case CNODE_STATUS_PENDING:
                cNodeStatus = <div className="conn-status-cnode pending">trying to connect cNode</div>;
                break;
            case CNODE_STATUS_DISCONNECTED:
                cNodeStatus = <div className="conn-status-cnode disconnected">cNode disconnected</div>;
                break;
        }
            switch (this.props.pyNodeStatus) {
            case PYNODE_STATUS_CONNECTED:
                pyNodeStatus = <div className="conn-status-pynode connected">pyNode connected</div>;
                break;
            case PYNODE_STATUS_PENDING:
                pyNodeStatus = <div className="conn-status-pynode pending">trying to connect pyNode</div>;
                break;
            case PYNODE_STATUS_DISCONNECTED:
                pyNodeStatus = <div className="conn-status-pynode disconnected">pyNode disconnected</div>;
                break;
        }
        return <div className="conn-status-wrapper">
            {cNodeStatus}
            {pyNodeStatus}
        </div>
    }
}
