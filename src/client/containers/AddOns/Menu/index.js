import React, { Component } from 'react';
import * as style from './style.module.scss';
import PastelLogo from '../../../assets/logo/Pastel_logo_Secondary_white.png';
import DefaultUser from '../../../assets/images/default_user.png';
import { withRouter } from 'react-router-dom';
import { Home, Register, Gallery, Info, Logout } from '../../../components/icons';
import { SET_CURRENT_PASTEL_ID } from '../../../actionTypes';
import { connect } from 'react-redux';

const MenuItem = (props) => {
  const { icon, name, menuActive, ...rest } = props;
  return <div className={`${style['menu-item']} ${menuActive ? style['menu-active'] : ''}`} {...rest}>
    {icon}
    <span>{name}</span>
  </div>;
};

class Menu extends Component {
  render () {
    const { match, location, history } = this.props;
    if (location.pathname.startsWith('/pastel_id')) {
      return null;
    }
    const isActive = (url) => location.pathname.startsWith(url);

    let link = <h6 onClick={() => history.push('/profile')}>Edit</h6>;
    if (isActive('/profile')) {
      link = <h6 onClick={() => history.goBack()}>Save and back</h6>;
    }
    return <div className={style.wrapper}>
      <img src={PastelLogo} alt="" className={style.logo}/>
      <div className={`${style.user} ${isActive('/profile') ? style['menu-active'] : ''}`}>
        <img src={DefaultUser}/>
        <div>
          <h3>User Name</h3>
          {link}
        </div>
      </div>
      <MenuItem name={'Main screen'} icon={<Home/>} menuActive={isActive('/main')} onClick={() => history.push('/main')}/>
      <MenuItem name={'Register image'} icon={<Register/>} menuActive={isActive('/register')}
                onClick={() => history.push('/register')}/>
      <MenuItem name={'Artwork gallery'} icon={<Gallery/>} menuActive={isActive('/gallery')}
                onClick={() => history.push('/gallery')}/>
      <MenuItem name={'Information'} icon={<Info/>} menuActive={isActive('/info')} onClick={() => history.push('/info')}/>
      <div className={style.logout} onClick={() => {
        this.props.dispatch({type: SET_CURRENT_PASTEL_ID, value: null});
        history.push('/pastel_id/select');
      }}>
        <div>
          <Logout/>
        </div>

        <div>Logout</div>
      </div>
    </div>;
  }
}

export default withRouter(connect(null)(Menu));
