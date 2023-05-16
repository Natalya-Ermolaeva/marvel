import img from '../../components/errorMessage/error.gif';
import './error.scss';

const ErrorMessage = () => {
    return (
        <img className='error-message' src={img} alt='Error'/>
    )
}

export default ErrorMessage;
