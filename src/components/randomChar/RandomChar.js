import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomchar.scss';

import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [char, setChar] = useState({});

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId)
        }
    },[])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();

        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
      
        getCharacter(id)
            .then(onCharLoaded)
    }

    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !char) ? <ViewRandomChar char={char}/> : null;

    return (
        <div className="randomchar">
            {spinner}
            {errorMessage}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button_main" onClick={updateChar}>
                    <div className="inner">Try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const ViewRandomChar = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    const imgStyle = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? {objectFit: "fill"} : {objectFit: "cover"};

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt={name} className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button_main">
                        <div className="inner">Homepage</div>
                    </a>
                    <a href={wiki} className="button button_secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;
