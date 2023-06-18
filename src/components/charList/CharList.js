import { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) =>  {
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        request();
    }, [])

    const request = () => {
        charListLoading();
        marvelService.getAllCaracters(offset)
            .then(charListLoaded)
            .catch(onError);
    }

    const charListLoading = () => {
        setNewItemLoading(true);
    }

    const charListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList((charList) => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(ended);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (i) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[i].classList.add('char__item_selected');
        itemRefs.current[i].focus();
    }
  
    const renderCharItems = (charList) => {
        const items = charList.map(({id, name, thumbnail}, i) => {
            const imgStyle = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? {objectFit: "contain"} : {objectFit: "cover"};
    
            return (
                <li className="char__item"
                    tabindex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={id} 
                    onClick={() => {
                        props.onCharSelected(id)
                        focusOnItem(i)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        });
    
        return  (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
 
   
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error) ? renderCharItems(charList) : null;

    return (
        <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
            <button className="button button_main button_long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={request}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
} 

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
