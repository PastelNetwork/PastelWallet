import React, { Component } from 'react';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { Wrapper, Card, Input } from '../../components/common';
import AddImage from './AddImage';

class RegisterImage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      file: null,
      artName: '',
      numCopies: 0,
      filePath: '',

      artistName: '',
      artistWebsite: '',
      artistWrittenStatement: '',
      artworkSeriesName: '',
      artworkCreationVideoYoutubeUrl: '',
      artworkKeywordSet: ''
    };
  }

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
          <AddImage/>

        </div>

      </Card>

    </Wrapper>;
  }
}

export default connect(null)(RegisterImage);
