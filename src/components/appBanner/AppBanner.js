import './appBanner.scss';

import avengers from '../../resources/img/avengers.png';
import avengersLogo from '../../resources/img/avengers_logo.png';

const appBanner = () => {
    return (
        <div className="app__banner">
            <img src={avengers} alt="Avengers"/>
            <div className="app__banner-text">
                New comics every week!<br/>
                Stay tuned!
            </div>
            <img src={avengersLogo} alt="Avengers logo"/>
        </div>
    )
}

export default appBanner;
