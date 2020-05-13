import React, { Component } from 'react';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { Wrapper, Card, Input, Button } from '../../components/common';
import AddImage from './AddImage';
import { BTN_TYPE_GREEN, BTN_TYPE_LIGHT_GREEN } from '../../components/common/constants';

class RegisterImage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // reg form fields
      artName: '',
      numCopies: 0,
      filePath: '',

      artistName: '',
      artistWebsite: '',
      artistWrittenStatement: '',
      artworkSeriesName: '',
      artworkCreationVideoYoutubeUrl: '',
      artworkKeywordSet: '',

      // other data
      confirmDecline: false
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onAddImageChange = (filePath) => {
    this.setState({ filePath });
  };

  render () {
    const inputs = ['artName', 'artistName', 'artistWebsite', 'artistWrittenStatement', 'artworkSeriesName', 'artworkCreationVideoYoutubeUrl', 'artworkKeywordSet', 'numCopies'];
    const labels = {
      artName: 'Art name',
      artistName: 'Artist name',
      artistWebsite: 'Artist website',
      artistWrittenStatement: 'Artist written statement',
      artworkSeriesName: 'Artwork series name',
      artworkCreationVideoYoutubeUrl: 'Artwork creation video youtube url',
      artworkKeywordSet: 'Artwork keyword set',
      numCopies: 'Number of copies'
    };
    const btnsDisabled = this.state.filePath === '';
    return <Wrapper>
      <Card style={{ width: '100%' }} className={style.register}>
        <h3>REGISTER IMAGE</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {inputs.map((item, idx) => {
            return <Input name={item} label={labels[item]} style={{ lineHeight: '20px', width: '100%' }}
                          containerStyle={{
                            marginTop: '13px',
                            width: 'calc(50% - 5px)',
                            marginRight: `${idx % 2 === 0 ? '10px' : 0} `
                          }} onChange={this.onChange}
                          value={this.state.address} key={idx}/>;
          })}

          <AddImage style={{ width: 'calc(50% - 5px)' }} onChange={this.onAddImageChange}/>
          <div className={style.errors}>
            {/*Errors*/}
          </div>
        </div>
        <div className={style.message}>
          Preliminary network fee:
          <span> 100 PSL</span>
        </div>
        <div className={style.btns}>
          {this.state.confirmDecline ?
            <React.Fragment>
              <div className={style.msg}>
                Are you sure want to stop registration?
              </div>
              <Button btnType={BTN_TYPE_GREEN} style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}>Yes</Button>
              <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: 'calc(50% - 5px)' }}
                      onClick={() => this.setState({ confirmDecline: false })}>No</Button>

            </React.Fragment>
            :
            <React.Fragment>
              <Button btnType={BTN_TYPE_GREEN} style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}
                      disabled={btnsDisabled}>Get
                fee</Button>
              <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: 'calc(50% - 5px)' }}
                      onClick={() => this.setState({ confirmDecline: true })}
                      disabled={btnsDisabled}>Decline</Button>
            </React.Fragment>
          }
        </div>

      </Card>

    </Wrapper>;
  }
}

export default connect(null)(RegisterImage);
