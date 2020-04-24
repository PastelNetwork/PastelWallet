import {connect} from 'react-redux';
import PastelIdHome from "../../components/pastel_id_selection/Home";


const mapStateToProps = state => ({
    blockchainAddress: state.blockchainAddress,
    artworks: state.artworks,
    masternodes: state.masternodes
});

const mapDispatchToProps = dispatch => ({
    dispatch
});


export const PastelIdHomeContainer = connect(mapStateToProps, mapDispatchToProps)(PastelIdHome);
