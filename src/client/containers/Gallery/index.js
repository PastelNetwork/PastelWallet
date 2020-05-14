import React, { Component } from 'react';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { Card, Wrapper } from '../../components/common';
import Filter from './Filter';

class Gallery extends Component {
  onFilterChange = (value) => {
    console.log(value);
  };
  render () {
    return <Wrapper>
      <Card style={{ width: '100%' }} className={style.gallery}>
        <h3>ARTWORK GALLERY</h3>
        <Filter onChange={this.onFilterChange} style={{marginTop: '24px'}}/>
      </Card>
    </Wrapper>
  }
}

export default connect(state => ({
  data: state.artworks.data,
  loading: state.artworks.loading
}))(Gallery);
