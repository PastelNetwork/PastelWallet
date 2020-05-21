import React, { Component } from 'react';
import * as style from './style.module.scss';
import { Wrapper, Card } from '../../components/common';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../ipc/ipc';

class Profile extends Component {
  componentDidMount () {
    if (!this.props.fetched) {
      ipcRenderer.send('getProfile', {pastelid: this.props.pastelID});
    }
  }

  render () {
    console.log(this.props);
    return <Wrapper>
      <div style={{ display: 'flex' }}>
        <Card className={style.avatar}>
          <h3>AVATAR</h3>
        </Card>
        <Card className={style.info}>
          <h3>CONTACT INFO</h3>
        </Card>
      </div>
    </Wrapper>;
  }
}

export default connect(state => ({
  photo: state.profile.photo,
  firstName: state.profile.firstName,
  lastName: state.profile.lastName,
  phone: state.profile.phone,
  email: state.profile.email,
  fetched: state.profile.fetched,
  pastelID: state.pastelid.currentPastelID
}))(Profile);
