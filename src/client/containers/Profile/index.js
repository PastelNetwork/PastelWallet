import React, { Component } from 'react';
import * as style from './style.module.scss';
import { Wrapper, Card, Input } from '../../components/common';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../ipc/ipc';
import DefaultUser from '../../assets/images/default_user.png';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      photo: this.props.photo,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      phone: this.props.phone,
      email: this.props.email,
      errors: []
    };
  }

  componentDidMount () {
    if (!this.props.fetched) {
      ipcRenderer.send('getProfile', { pastelid: this.props.pastelID });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render () {
    return <Wrapper>
      <div style={{ display: 'flex' }}>
        <Card className={style.avatar}>
          <h3>AVATAR</h3>
          <img src={this.state.photo ? this.state.photo : DefaultUser} alt=""/>
          <p style={{ color: 'var(--blue)', marginTop: '9px' }}>Change photo</p>
          <p style={{ color: 'var(--error)' }} onClick={() => this.setState({photo: null})}>Delete photo</p>
        </Card>
        <Card className={style.info}>
          <h3>CONTACT INFO</h3>
          <div style={{ display: 'flex' }}>
            <Input name="firstName" label="First Name" style={{ width: '100%' }}
                   containerStyle={{ width: '206px', marginRight: '10px' }}
                   onChange={this.onChange} value={this.state.firstName}
            />
            <Input name="lastname" label="Last Name" style={{ width: '100%' }}
                   containerStyle={{ width: '206px' }}
                   onChange={this.onChange} value={this.state.lastName}/>
          </div>
          <div style={{ marginTop: '10px', display: 'flex' }}>
            <Input name="phone" label="Phone" style={{ width: '100%' }}
                   containerStyle={{ width: '206px', marginRight: '10px' }}
                   onChange={this.onChange} value={this.state.phone}/>
            <Input name="email" label="Email" style={{ width: '100%' }}
                   containerStyle={{ width: '206px' }}
                   onChange={this.onChange} value={this.state.email}/>
          </div>
          <ul className={style.error}>
            {this.state.errors.map(error => <li>{error}</li>)}
          </ul>
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
