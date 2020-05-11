import React, { Component } from 'react';
import {
  NODE_STATUS_CONNECTED,
  NODE_STATUS_DISCONNECTED,
  NODE_STATUS_PENDING
} from '../../../client/constants';
import { connect } from 'react-redux';
import * as style from './style.module.scss';

const statusColor = {
    [NODE_STATUS_CONNECTED]: 'var(--success)',
    [NODE_STATUS_PENDING]: 'var(--pending)',
    [NODE_STATUS_DISCONNECTED]: 'var(--failure)'
};
const statusMsg = {
    [NODE_STATUS_CONNECTED]: 'connected',
    [NODE_STATUS_PENDING]: 'trying to connect',
    [NODE_STATUS_DISCONNECTED]: 'disconnected'
};

class NodeStatus extends Component {
  render () {
    const {cNodeStatus, pyNodeStatus} = this.props;
    return <div className={style['node-status']}>
       cNode&nbsp;<span style={{color: statusColor[cNodeStatus], marginRight: '16px'}}>{statusMsg[cNodeStatus]}</span>
       pyNode&nbsp;<span style={{color: statusColor[pyNodeStatus]}}> {statusMsg[pyNodeStatus]}</span>
    </div>;
  }
}

export default connect(state => ({
  cNodeStatus: state.cNodeStatus,
  pyNodeStatus: state.pyNodeStatus
}), null)(NodeStatus);
