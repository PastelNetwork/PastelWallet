import React, {Component} from "react";
import history from '../../history';


export class Profile extends Component {
    onImageClick = () => {
        history.push('/user_profile');
    };

    render() {
        return <div className="column is-5">
            <div className="flat-card profile-card is-auto">
                <div className="card-body">
                    <div className="profile-image" onClick={this.onImageClick}>
                        <img src="https://i.pravatar.cc/200" alt=""/>
                    </div>
                    <div className="username has-text-centered">
                        <span>Elie Daniels</span>
                        <small>Member since Sep 23 2017</small>
                    </div>
                </div>
            </div>
        </div>

    }
}
