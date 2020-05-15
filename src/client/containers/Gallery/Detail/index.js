import React, { Component } from 'react';
import { Wrapper, Card } from '../../../components/common';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import history from '../../../history';

// {
//     'artistPastelId': artwork.artist_pastelid,
//     'name': artwork.artwork_title,
//     'numOfCopies': artwork.total_copies,
//     'copyPrice': -1,
//     'thumbnailPath': artwork.get_thumbnail_path(),
//     'artistName': artwork.artist_name,
//     'artistWebsite': artwork.artist_website,
//     'artistWrittenStatement': artwork.artist_written_statement,
//     'artworkSeriesName': artwork.artwork_series_name,
//     'artworkCreationVideoYoutubeUrl': artwork.artwork_creation_video_youtube_url,
//     'artworkKeywordSet': artwork.artwork_keyword_set,
//     'imageHash': artwork.get_image_hash_digest(),
//     'blocknum': artwork.blocknum,
//     'orderBlockTxid': artwork.order_block_txid
// }

class Detail extends Component {
  render () {
    const imageHash = this.props.match.params.image_hash;
    const data = this.props.artworksData.filter(a => a.imageHash === imageHash)[0];
    const {name} = data;
    return <Wrapper>
      <Card>
        <div onClick={() => history.goBack()}>{'<<'} Back to gallery</div>
        <div className={style.artwork}>
          TXID: {'txid'}
          <h1>{name}</h1>
        </div>
      </Card>
    </Wrapper>;
  }
}

export default connect(state => ({artworksData: state.artworks.data}))(Detail);
