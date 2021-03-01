import React, { Component } from 'react';
import {Wrapper, Card, Button, Input, Spinner} from '../../../components/common';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import history from '../../../history';
import { BTN_TYPE_GREEN, BTN_TYPE_LIGHT_GREEN } from '../../../components/common/constants';
import { getSampleSaleData } from '../index';
import {
    ADD_ARTWORK_TO_SELL_LOADING,
    SET_ARTWORKS_ERRORS,
    SET_ARTWORKS_MESSAGES,
    SET_TICKET_ERROR, SET_TICKET_MSG
} from "../../../actionTypes";
import {ipcRenderer} from "../../../ipc/ipc";

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

const humanReadableFieldNames = {
  artistPastelId: 'Artist Pastel ID',
  numOfCopies: 'Total copies',
  copyPrice: ' Copy price',
  artistWebsite: 'Artist website',
  artistWrittenStatement: 'Artist written statement',
  artworkSeriesName: 'Artwork series',
  artworkCreationVideoYoutubeUrl: 'Creation video URL',
  artworkKeywordSet: 'Keywords',
  imageHash: 'Artwork image hash (SHA3-512 digest)',
  blocknum: 'Registration ticket block number'
};

const dataFieldNames = ['artistPastelId', 'numOfCopies', 'copyPrice', 'artistWebsite', 'artistWrittenStatement', 'artworkSeriesName', 'artworkCreationVideoYoutubeUrl', 'artworkKeywordSet', 'imageHash', 'blocknum'];

class Detail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sellMode: false,
      buyMode: false,
      price: 0
    };
  }

  onConfirmBuyClick = (data) => {
    this.props.dispatch({type: ADD_ARTWORK_TO_SELL_LOADING, artwork_hash: this.props.match.params.image_hash});
    ipcRenderer.send('buyArtworkRequest', {
        act_txid: data.actTicketTxid,
        data:{
            sell_txid: data.saleData.sell_txid,
            price: data.saleData.price,
        }
    });
  };
  onConfirmSellClick = (data) => {
    this.props.dispatch({type: ADD_ARTWORK_TO_SELL_LOADING, artwork_hash: this.props.match.params.image_hash});
    ipcRenderer.send('sellArtworkRequest',
      {
        txid: data.actTicketTxid,
        price: this.state.price,
        image_hash: this.props.match.params.image_hash
      });
    console.log(`Sent sellArtwork txid: ${data.actTicketTxid} price: ${data.saleData.price}`);
  };
  onErrorOkClick = () => {
    this.props.dispatch({type: SET_TICKET_ERROR, error: undefined});
    this.setState({sellMode: false});
  };
  onSuccessOkClick = () => {
    this.props.dispatch({type: SET_TICKET_ERROR, error: undefined});
    this.setState({sellMode: false});
    ipcRenderer.send('artworksDataRequest', {})
  };
  onOkClick = (data) =>{
    this.props.dispatch({type: SET_ARTWORKS_ERRORS, key:data.actTicketTxid, value: undefined});
    this.props.dispatch({type: SET_ARTWORKS_MESSAGES, key:data.actTicketTxid, value: undefined});
    this.setState({buyMode: false});
  }
  render () {
    const imageHash = this.props.match.params.image_hash;
    const data = this.props.artworksData ? this.props.artworksData.filter(a => a.imageHash === imageHash)[0] : {};
    const { forSale, price } = data.saleData ? data.saleData : {};
    const { name, orderBlockTxid, thumbnailPath, artistPastelId, actTicketTxid } = data;
    const isMy = artistPastelId === this.props.pastelId;
    const isLoading = this.props.artwork_sell_loading.indexOf(imageHash) !== -1;
    let dialog = null;
    let loading = <React.Fragment>
                  <p style={{marginTop: '9px',
                             fontSize: '14px',
                             color: 'var(--black)'}}><i>Ticket is being created..</i>
                  </p>
                  <Spinner style={{marginRight: '15px',
                                   float: 'right'}}/>
                </React.Fragment>;
    let getMessage = (message, event) => {
        return(<React.Fragment>
            <p style={{
              wordBreak: 'break-all',
              overflowY: 'scroll',
              scrollBehavior: 'smooth',
              marginRight: '10px'}}><i>{message}</i>
            </p>
            <Button btnType={BTN_TYPE_GREEN}
                    style={{
                      width: '145px',
                      marginLeft: '16px',
                      marginTop: '7px'}}
                    onClick={()=>event(data)}
            >Ok</Button>
          </React.Fragment>)
    }
    let button = isMy ?
      <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', height: '37px', marginTop: '20px' }}
              disabled={forSale} onClick={() => this.setState({ sellMode: true })}>Sell
        artwork</Button> :
      <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', height: '37px', marginTop: '20px' }}
              disabled={!forSale} onClick={() => this.setState({ buyMode: true })}>Buy
        artwork</Button>;

    if (this.state.sellMode) {
      if(isLoading){
              button = null;
              dialog = loading
      }else if (this.props.sell_error) {
              button = null;
              dialog = getMessage(this.props.sell_error, this.onErrorOkClick)
      }else if (this.props.sell_message) {
              button = null;
              dialog = getMessage(this.props.sell_message, this.onSuccessOkClick)
      }
      else{
              button = null;
              dialog = <React.Fragment>
                <Input type="number" name={'price'} label={'Set price'}
                       containerStyle={{ width: '270px' }}
                       style={{width: '270px', lineHeight: '20px'}}
                       value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })}
                />
                <Button btnType={BTN_TYPE_GREEN} style={{ width: '130px', height: '37px', marginTop: '5px', marginRight: '10px' }} onClick={() => this.onConfirmSellClick(data)}>Sell</Button>
                <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: '130px', height: '37px', marginTop: '5px' }}
                onClick={()=> this.setState({sellMode: false})}>Decline</Button>
              </React.Fragment>;
      }
    }

    if (this.state.buyMode) {
      if(isLoading){
              button = null;
              dialog = loading
      }else if (this.props.buyErrors[data.actTicketTxid]) {
              button = null;
              dialog = getMessage(this.props.buyErrors[data.actTicketTxid], ()=>this.onOkClick(data))
      }else if (this.props.buyMessages[data.actTicketTxid]) {
              button = null;
              dialog = getMessage(this.props.buyMessages[data.actTicketTxid], ()=>this.onOkClick(data))
      }
      else{
              button = null;
              dialog = <div style={{display: 'flex'}}>
                <p className={style['buy-confirm']}>Do you really want to buy this artwork?</p>
                <Button btnType={BTN_TYPE_GREEN} style={{ width: '60px', height: '37px', marginTop: '20px', marginRight: '10px' }} onClick={()=>this.onConfirmBuyClick(data)}>Yes</Button>
                <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: '60px', height: '37px', marginTop: '20px' }}
                onClick={()=> this.setState({buyMode: false})}>No</Button>
              </div>
      }
    }
    return <Wrapper>
      <Card>
        <div onClick={() => history.goBack()} className={style.backlink}>{'<<'} Back to gallery</div>

        <div className={style.artwork}>
          {isMy ? <div className={style['my-sticker']}>my</div> : null}
          {forSale ? <div className={style['sale-sticker']}>for sale</div> : null}
          <p className={style.txid}><span>TXID</span> {actTicketTxid}</p>
          <img src={`file://${thumbnailPath}`} alt=""/>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>{name}</h3>
              {forSale ? <span className={style.price}>
                {price} PSL
              </span> : null}
            </div>
            {button}
          </div>
          {dialog}
          <div style={{ marginTop: '20px' }}>
            {dataFieldNames.map((field, idx) => {
                if (data[field] === '' || !data[field]) {
                  return null;
                }
                return <div className={style.data} key={idx}>
                  <h5>{humanReadableFieldNames[field]}</h5>
                  <p>{data[field]}</p>
                  {idx !== dataFieldNames.length - 1 ? <div className={style.line}/> : null}
                </div>;
              }
            )}
          </div>

        </div>
      </Card>
    </Wrapper>;
  }
}

export default connect(
  state => ({
    pastelID: state.pastelid.currentPastelID,
    artworksData: state.artworks.data,
    pastelId: state.pastelid.currentPastelID,
    buyErrors: state.artworks.buyErrors,
    buyMessages: state.artworks.buyMessages,
    sell_error: state.artworks.sell_error,
    sell_message: state.artworks.sell_message,
    artwork_sell_loading: state.artworks.artwork_sell_loading
  }))
(Detail);
