import React, {useState, useEffect, useRef} from 'react';
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props; //Object Destructuring to specify prop in useEffect array
  const [ enteredFilter, setEnteredFilter ] = useState('');
  const inputRef = useRef();

  //Getting Ingredient from firebase
  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0
        ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-practice-abbe4.firebaseio.com/ingredient.json'+query)
        .then(response => response.json())
        .then(responseData => {
          const loadedIngredient = [];
          for(const key in responseData){
            loadedIngredient.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount
            })
          }
           onLoadIngredients(loadedIngredient);
        }) 
      }
    }, 500); //Execute this function when the user stops typing for 500 ms
    return () => clearTimeout(timer); //Cleanup Function
  },[enteredFilter, onLoadIngredients, inputRef]); //Triggers only when both state and props changes

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
          ref={inputRef}
          type="text"
          value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
