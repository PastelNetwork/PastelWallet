import React, { Component } from 'react';
import { MainWrapper } from '../../components/MainWrapperComponent';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import history from '../../history';

class ArtworkDetails extends Component {

  render() {
    const imageHash = this.props.match.params.image_hash;
    // fetch required artwork by image_hash
    let artwork = this.props.artworksData.filter(a => a.imageHash === imageHash)[0];
    return <MainWrapper>
      <button onClick={() => history.push('/artworks')}>Back</button>
      <h1>{artwork.name}</h1>
    </MainWrapper>;
  }
}

export default connect(state => ({
  artworksData: state.artworksData,
}), dispatch => ({dispatch}))(ArtworkDetails);
