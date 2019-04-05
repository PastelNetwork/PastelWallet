import React, {Component} from 'react';
import '../../styles.scss';

export class Footer extends Component {
    render() {
        return <footer className="flex-col flex-centered">
            <div className="footer-row flex-row space-around footer-tbl pt-3">
                <div>Logo</div>
                <div>Platform</div>
                <div>Token</div>
                <div>Masternodes</div>
                <div>Business</div>
                <div>Community</div>
            </div>
            <div className="flex-row footer-row space-around">
                <img src="https://via.placeholder.com/65" alt="img1"/>
                <img src="https://via.placeholder.com/65" alt="img2"/>
                <img src="https://via.placeholder.com/65" alt="img3"/>
            </div>
            <div className="footer-row flex-row space-around">
                <div>Link1</div>
                <div>Link2</div>
            </div>
        </footer>
    }
}