import React, {Component} from "react";
import history from '../../history';
import {connect} from "react-redux";
import {fetchProfile} from "../../actions";


class ProfileComponent extends Component {
    onImageClick = () => {
        history.push('/user_profile');
    };

    componentDidMount() {
        if (!this.props.userProfile) {
            this.props.dispatch(fetchProfile())
        }
    }

    render() {
        let name = '';
        if (this.props.userProfile && this.props.userProfile.first_name && this.props.userProfile.last_name) {
            name = `${this.props.userProfile.first_name} ${this.props.userProfile.last_name}`;
        }
        const dateJoined = this.props.userProfile ? this.props.userProfile.date_joined_for_human : '';
        const picture = this.props.userProfile ? this.props.userProfile.picture : '';
        return <div className="column is-5">
            <div className="flat-card profile-card is-auto">
                <div className="card-body">
                    <div className="profile-image" onClick={this.onImageClick}>
                        <img src={picture} alt="" className="profile-img"/>
                    </div>
                    <div className="username has-text-centered">
                        <span>{name}</span>
                        <small>Member since {dateJoined}</small>
                    </div>
                </div>
            </div>
        </div>

    }
}


export const Profile = connect(state => ({
    userProfile: state.userProfile
}), dispatch => ({
    dispatch
}))(ProfileComponent);
