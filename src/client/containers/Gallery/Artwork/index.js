import React, { Component } from 'react';
import * as style from './style.module.scss';
import { Button } from '../../../components/common';
import { connect } from 'react-redux';
import { BTN_TYPE_GREEN, BTN_TYPE_LIGHT_GREEN } from '../../../components/common/constants';
import history from '../../../history';

class Artwork extends Component {
  constructor (props) {
    super(props);
    this.state = {
      buyMode: false
    };
  }

  onBuyClick = () => {
    this.setState({buyMode: true});
  };

  render () {
    const { artistPastelId, name, numOfCopies, thumbnailPath, imageHash } = this.props.data;
    const { forSale, price } = this.props.saleData;

    let bottomBlock = <React.Fragment>
      <Button style={{ width: '145px', marginLeft: '16px', marginTop: '7px' }}
              onClick={() => history.push(`/gallery/${imageHash}`)}>More details</Button>

      {forSale ?
        <div style={{
          display: 'flex', paddingLeft: '16px', paddingTop: '3px', justifyContent: 'space-between',
          paddingRight: '14px'
        }}>
            <span className={style.price}
                  style={{ color: 'var(--success)', fontSize: '16px', lineHeight: '37px' }}>{price} PSL</span>
          <Button btnType={BTN_TYPE_GREEN} style={{ width: '72px' }} onClick={this.onBuyClick}>Buy</Button>
        </div> : null}
    </React.Fragment>;
    if (this.state.buyMode) {
      bottomBlock = <React.Fragment>
        <p><i>Do you really want to buy this artwork?</i></p>
        <Button btnType={BTN_TYPE_GREEN} style={{ width: '100%' }} onClick={this.onBuyClick}>Yes</Button>
        <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: '100%' }}
                onClick={() => this.setState({ buyMode: false })}>No</Button>
      </React.Fragment>;
    }
    return <div className={style.artwork} style={this.state.buyMode ? {height: '381px'} : {}}>
      {artistPastelId === this.props.pastelID ?
        <div className={style['my-sticker']}>my</div> : null}
      {forSale ?
        <div className={style['sale-sticker']}>for sale</div> : null}

      <img src={`file://${thumbnailPath}`} alt=""/>
      <h4>{name}</h4>
      <div className={style['col-container']}>
        <p><b>Total</b> {numOfCopies} copies</p>
        <p><b>Pastel ID</b> {artistPastelId.substr(0, 10)}</p>
        {bottomBlock}
      </div>
    </div>;
  }
}

export default connect(state => (
  { pastelID: state.others.currentPastelID }
))(Artwork);
