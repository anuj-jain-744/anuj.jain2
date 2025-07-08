import Spinner from 'react-bootstrap/Spinner';
import './index.scss';


function DefaultSpinner() {
  return (
    <div className='spinner-container'>
      <Spinner animation="border" data-testid="loading-spinner" />
    </div>
  );
}

export default DefaultSpinner;