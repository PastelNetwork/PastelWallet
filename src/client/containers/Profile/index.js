import React, { Component } from 'react';
import * as style from './style.module.scss';
import { Wrapper, Card, Input } from '../../components/common';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../ipc/ipc';
import DefaultUser from '../../assets/images/default_user.png';
import { SET_USER_PROFILE_EDIT_DATA } from '../../actionTypes';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.fileInputRef = React.createRef();
  }

  componentDidMount () {
    if (!this.props.fetched) {
      ipcRenderer.send('getProfile', { pastelid: this.props.pastelID });
    }
  }

  onChange = (e) => {
    this.props.dispatch({ type: SET_USER_PROFILE_EDIT_DATA, field: e.target.name, value: e.target.value });
    this.props.errors && this.props.dispatch({ type: SET_USER_PROFILE_EDIT_DATA, field: 'errors', value: [] });
  };

  onImgChange = (e) => {
    if (e.target.files.length) {
      this.props.dispatch({
        type: SET_USER_PROFILE_EDIT_DATA,
        field: 'photo',
        value: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  render () {
    return <Wrapper>
      <div style={{ display: 'flex' }}>
        <Card className={style.avatar}>
          <h3>AVATAR</h3>
          <input type="file" accept="image/*" id="idArtFile"
                 onChange={this.onImgChange} ref={this.fileInputRef}
                 style={{ visibility: 'hidden', position: 'absolute' }}/>

          <img src={this.props.photo ? this.props.photo : DefaultUser} alt=""/>
          <p style={{ color: 'var(--blue)', marginTop: '9px' }} onClick={() => this.fileInputRef.current.click()}>
            Change photo</p>
          <p style={{ color: 'var(--error)' }} onClick={() => this.props.dispatch({
            type: SET_USER_PROFILE_EDIT_DATA,
            field: 'photo',
            value: null
          })}>Delete photo</p>
        </Card>
        <Card className={style.info}>
          <h3>CONTACT INFO</h3>
          <div style={{ display: 'flex' }}>
            <Input name="firstName" label="First Name" style={{ width: '100%' }}
                   containerStyle={{ width: '206px', marginRight: '10px' }}
                   onChange={this.onChange} value={this.props.firstName}
            />
            <Input name="lastName" label="Last Name" style={{ width: '100%' }}
                   containerStyle={{ width: '206px' }}
                   onChange={this.onChange} value={this.props.lastName}/>
          </div>
          <div style={{ marginTop: '10px', display: 'flex' }}>
            <Input name="phone" label="Phone" style={{ width: '100%' }}
                   containerStyle={{ width: '206px', marginRight: '10px' }}
                   onChange={this.onChange} value={this.props.phone}/>
            <Input name="email" label="Email" style={{ width: '100%' }}
                   containerStyle={{ width: '206px' }}
                   onChange={this.onChange} value={this.props.email}/>
          </div>
          <ul className={style.error}>
            {this.props.errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
        </Card>
      </div>
    </Wrapper>;
  }
}

export default connect(state => ({
  photo: state.profileEdit.photo,
  firstName: state.profileEdit.firstName,
  lastName: state.profileEdit.lastName,
  phone: state.profileEdit.phone,
  email: state.profileEdit.email,
  errors: state.profileEdit.errors,
  fetched: state.profile.fetched,
  pastelID: state.pastelid.currentPastelID
}))(Profile);
