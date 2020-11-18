import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredients'
const burger = (props) => {
    let transformedIngredients = Object.keys( props.ingredients ).map( igKey => {
            //console.log([...Array( props.ingredients[igKey])],igKey);
            return [...Array( props.ingredients[igKey] )].map( ( _, i ) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            } );
        } )
        //1st argument is previous value and 2nd argument is current value 
        //The reduce() method executes a reducer function (that you provide) on each element of the array, resulting in a single output value.
        //MDN documentation
        .reduce((arr,el) => {
            //console.log(arr,el)
            return arr.concat(el);
        },[]);
        if (transformedIngredients.length === 0){
            transformedIngredients = <p>Please start adding ingredients</p>
        }
    //console.log(transformedIngredients);
    //The Object.keys() method returns an array of a given object's own enumerable property names, iterated in the same order that a normal loop would.
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom' />
            
        </div>
    );
}

export default burger;