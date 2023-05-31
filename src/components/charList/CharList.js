import { Component } from 'react';

import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component  {
    state = {
        charList: [], 
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.request();
    }

    request = () => {
        this.charLoading();
        this.marvelService.getAllCaracters(this.state.offset)
            .then(this.setChar)
            .catch(this.setError);
    }

   charLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    setChar = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    setError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (i) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[i].classList.add('char__item_selected');
        this.itemRefs[i].focus();
    }
  
    renderCharItems(charList) {
        const items = charList.map(({id, name, thumbnail}, i) => {
            const imgStyle = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? {objectFit: "contain"} : {objectFit: "cover"};
    
            return (
                <li className="char__item"
                    tabindex={0}
                    ref={this.setRef}
                    key={id} 
                    onClick={() => {
                        this.props.onCharSelected(id)
                        this.focusOnItem(i)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(id);
                            this.focusOnItem(i);
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
 
    render() {
        const {charList, loading, error, newItemLoading, charEnded} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? this.renderCharItems(charList) : null;

        return (
            <div className="char__list">
                    {spinner}
                    {errorMessage}
                    {content}
                <button className="button button_main button_long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={this.request}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    } 
} 

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
