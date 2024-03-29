/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading': 
            return newItemLoading ? <Component/> : <Spinner/>; 
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) =>  {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {process, setProcess, getAllCharacters} = useMarvelService();

    useEffect(() => {
        request(offset, true);
    }, [])

    const request = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(charListLoaded)
            .then(() => setProcess('confirmed'))
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
                <CSSTransition key={i} timeout={500} classNames="char__item">
                    <li className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
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
                </CSSTransition>
            )
        });
    
        return  (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderCharItems(charList), newItemLoading)
    }, [process])
 
       return (
        <div className="char__list">
            {elements}
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
