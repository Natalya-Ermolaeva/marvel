/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/SetContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null); 
   
    const {process, setProcess, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        const {charId} = props;

        if (!charId) {
            return;
        }

        clearError();

        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

       return (
        <div className="char__info">
            {setContent(process, ViewCharInfo, char)}
        </div>
    )
}

const ViewCharInfo = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    const imgStyle = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? {objectFit: "fill"} : {objectFit: "cover"};

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button_main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button_secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? 'There is no comics with this character' : null}

                {comics.map((item, i) => {
                    // eslint-disable-next-line
                    if (i > 9) return;
                    return (
                        <Link key={i} to={`/comics/${item.resourceURI.slice(item.resourceURI.lastIndexOf('/') + 1)}`} style={{'display': 'block'}}>
                            <li className="char__comics-item">
                                {item.name}
                            </li>
                        </Link>
                    )
                })}
            </ul>
        </>
    )
} 

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;
