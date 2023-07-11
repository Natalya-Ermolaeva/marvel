import { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) =>  {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        request(offset, true);
    }, [])

    const request = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(charListLoaded)
    }

    const charListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList((charList) => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (i) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[i].classList.add('char__item_selected');
        itemRefs.current[i].focus();
    }
  
    const renderCharItems = (charList) => {
        const items = charList.map(({id, name, thumbnail}, i) => {
            const imgStyle = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? {objectFit: "fill"} : {objectFit: "cover"};
    
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
 
    const spinner = loading && !setNewItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = renderCharItems(charList);

    return (
        <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
            <button className="button button_main button_long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => request(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
} 

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
