import React from "react";

export const Profile = (props) => {
    return <div className="column is-5">

        <div className="flat-card profile-card is-auto">
            <div className="card-body">
                <div className="profile-image">
                    <img src="https://i.pravatar.cc/200" alt=""/>
                </div>
                <div className="username has-text-centered">
                    <span>Elie Daniels</span>
                    <small>Member since Sep 23 2017</small>
                </div>
            </div>
        </div>
    </div>

};
