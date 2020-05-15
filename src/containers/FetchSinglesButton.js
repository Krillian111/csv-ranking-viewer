import { connect } from 'react-redux';
import { fetchSingles } from '../store/actions/stats/singles/fetchSingles';
import PrimaryButton from '../components/0atom/button/PrimaryButton';

const mapDispatchToProps = {
    label: 'Fetch data',
    onClick: fetchSingles,
};

export default connect(null, mapDispatchToProps)(PrimaryButton);
