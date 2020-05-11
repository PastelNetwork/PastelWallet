import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as style from './style.module.scss';

const logHeight = 100;
class LogTab extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: false
    };
  }
  onClick = () => {
    this.setState({expanded: !this.state.expanded});
  };
  render () {

    let tabStyle={};
    let circleStyle={};
    if (this.state.expanded) {
      tabStyle = {
        height: logHeight + 'px',
        cursor: 'auto'
      };
      circleStyle = {
        bottom: (-150 + logHeight + 11)+'px',
        lineHeight: 0.7
      }
    }
    return <React.Fragment>
      <div className={style['log-tab-circle']} onClick={this.onClick} style={circleStyle}>
        {this.state.expanded? 'v' : '^'}
      </div>
      <div className={style['log-tab']} onClick={() => this.setState({expanded: true})} style={tabStyle}>
        {!this.state.expanded ? 'Show logs': <div className={style.logs}>
          {this.props.messages}
        </div> }
      </div>
    </React.Fragment>;
  }
}

export default connect(state => ({ messages: state.userDisplayMessages }))(LogTab);
