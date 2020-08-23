import React, {useCallback, useReducer} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredient, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredient, action.ingredient];
    case 'DELETE':
      return currentIngredient.filter(ing => ing.id !== action.id);
    default:
      throw new Error("Should Not Reach here");      
  }
}

//Reducer when multiple states depend on each other
const httpReducer = (currHttpState, action) => {
  switch(action.type){
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...currHttpState, loading: false};
    case 'ERROR':
      return { loading: false, error: action.errorMessage};
    case 'CLEAR':
      return { ...currHttpState, error: null};
    default:
      throw new Error("Should Not Reach here");        
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHTTP] = useReducer(httpReducer, {loading: false, error: null}); //Connecting 2 states
  //const [userIngredients, setIngredients] = useState([]); //Array as state, usually there's an object instead
  // const [isLoading, setisLoading] = useState(false);
  // const [error, setError] = useState();

  //Getting Ingredient from firebase in Search.js
  
  //Adding Ingredient to the Ingredient Form
  //This function should be pointed by IngredientForm because there we obtain the Title & Amount and submit to add
  const AddIngredientHandler = ingredient => { //The "ingredient" contains Title & Amount
  //setisLoading(true); // Activate Loader as soon as add ingredient is clicked
  dispatchHTTP({type: 'SEND'});
  fetch('https://react-hooks-practice-abbe4.firebaseio.com/ingredient.json' ,{
    method: 'POST',
    body: JSON.stringify(ingredient),
    headers: {'Content-Type' : 'application/json'}
  }).then(response => {
     // setisLoading(false); //Deactivate loader as soon as response is recieved
   dispatchHTTP({type: 'RESPONSE'});
    return response.json();
  }).then(responseData => {
    //Updating the state while ensuring that latest ingredient is added
  //   setIngredients(prevIngredients => [...prevIngredients, 
  //The ingredient must include ID, Title & Amount so to create id
  //   {id: Math.random().toString(), ...ingredient}
  //  ])
  //AFTER USEREUCER
  dispatch({type: 'ADD', ingredient: {id: Math.random().toString(), ...ingredient}});
  })
  .catch(err => dispatchHTTP({type: 'ERROR', errorMessage: 'SOMETHING WENT WRONG'}));
  }

  const filteredIngredientHandler = useCallback(filteredIngredients => {
    //AFTER USEREUCER
    dispatch({type: 'SET', ingredients: filteredIngredients})
  },[]);

  const removeIngredientHandler = useCallback(ingredientID => {
    //setisLoading(true);
    dispatchHTTP({type: 'SEND'});
    fetch(`https://react-hooks-practice-abbe4.firebaseio.com/ingredient/${ingredientID}.json` ,
    {
    method: 'DELETE'
    })
    .then( 
      response =>{
    //   // setisLoading(false);
    dispatchHTTP({type: 'RESPONSE'});
    //   // setIngredients(prevIngredients => 
    //   // prevIngredients.filter(ingredient => ingredient.id !== ingredientID))
    //   //AFTER USEREUCER
      dispatch({type: 'DELETE', id:ingredientID});
      })
      .catch(err => dispatchHTTP({type: 'ERROR', errorMessage: 'SOMETHING WENT WRONG'}));
  },[]);

  const closeHandler = () =>{
    dispatchHTTP({type: 'CLEAR'});
  }
  
  return (
    <div className="App">
      {/*Passing Props in IngredientForm where the arguments recieve Title and Amount which are then
      mapped in above function */}
      {httpState.error ? <ErrorModal onClose={closeHandler}>{httpState.error}</ErrorModal> : null} 
      <IngredientForm 
       loading = {httpState.loading}
       onAddIngredient={AddIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filteredIngredientHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
