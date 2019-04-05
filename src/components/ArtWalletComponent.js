import React, {Component} from 'react';
import '../styles.scss';
import {Header} from "./common/HeaderComponent";
import {Footer} from "./common/FooterComponent";
import {FlexRow} from "./common/FlexRowComponent";
import {LeftMenu} from "./common/LeftMenuComponent";
import axios from 'axios';
import history from '../history';

export class ArtWallet extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.state = {
            file: null
        }
    }

    componentDidMount() {
        document.title = 'Pastel wallet';
    }
    onClick = () => {
       history.push('/register');
    };
    onUploadClick = () => {
        this.fileInputRef.current.click();
    };
    onAddFile = (e) => {
        let file = this.fileInputRef.current.files[0];
        this.setState({file: URL.createObjectURL(file)});
    };
    onSubmitClick = (e) => {
        let file = this.fileInputRef.current.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.targer.result;
            //TODO: push result to django backend
            // axios.post()
        };
        reader.readAsBinaryString(file);
        debugger;
    };

    render() {
        return <React.Fragment>
            <Header/>
            <FlexRow>
                <LeftMenu/>
                <div className="main-page flex-col">
                    <section className="flex-col pt-3 pb-2 wrap">
                        <div className={this.state.file ? '' : 'display-none'}>
                            <div className="flex-col pb-2">
                                <div className="flex-row flex-centered">
                                    <img src={this.state.file} className="img-preview pb-1" alt=""/>
                                </div>
                                <div className="flex-row flex-centered">
                                    <button onClick={this.onSubmitClick}>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-row flex-end">
                            <div className="wallet-badge flex-col flex-centered" onClick={this.onClick}>
                                <div className="flex-row flex-centered">
                                    Artwork estimate
                                </div>
                            </div>
                            <div className="upload-btn flex-col flex-centered">
                                <div className="flex-row flex-centered" onClick={this.onUploadClick}>
                                    <i className="fa fa-arrow-up"></i>
                                    Upload artwork
                                    <input type="file" className="display-none" ref={this.fileInputRef}
                                           accept="image/*" onChange={this.onAddFile}/>
                                </div>
                            </div>
                        </div>
                    </section>


                    <section className="my-artwork flex-col">
                        <div className="flex-centered">
                            <h4>My Art</h4>
                        </div>
                        <div className="flex-centered">
                            <p>
                                See your current artwork for sale or track where your sold items are
                            </p>
                        </div>
                        <div className="flex-row wrap artworks">
                            <div className="art-item flex-col">
                                {/*<div class="star-icon flex-col"><i class="fa fa-star"></i></div>*/}
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                            <div className="art-item flex-col">
                                <img src="https://via.placeholder.com/150" alt="artwork"/>
                                <div className="flex-centered">Artwork1</div>
                            </div>
                        </div>
                    </section>
                </div>
            </FlexRow>
            <Footer/>
        </React.Fragment>
    }
}