import React,{ Component } from "react";
import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENTS_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class Burgerbuilder extends Component{
    state = {
        ingredients :null,
        /*{
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        }*/
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
    }

    componentDidMount(){
        axios.get('https://react-my-burger-31e62.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error:true})
            })
        
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert('you continue');
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'suraj pratap singh',
                address: {
                    street: '76-b',
                    zipcode: '110018',
                    country: 'Germany'
                },
                email: 'jarus9350pratap@gmail.com',
            },
            deliveryMethod:'fastest'
        }
        axios.post('/orders.json',order)
            .then(response => {
                this.setState({loading: false, purchasing : false})
            })
            .catch(error => {
                this.setState({loading: false, purchasing : false})
            });

    }

    updatePurchasable(ingredients){
        // const ingredients ={
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients).map((igKey) =>{
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        },0)
        this.setState({purchasable : sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice , ingredients: updatedIngredients});
        this.updatePurchasable(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice , ingredients: updatedIngredients});
        this.updatePurchasable(updatedIngredients);
        
    }

       render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let ordersummary = null;
        let burger = this.state.error ? <p>ingredients can't be loaded</p> : <Spinner/>
        if (this.state.ingredients){
        burger = (
            <Auxiliary>
                <Burger ingredients = {this.state.ingredients}/>
                <BuildControls ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler} 
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable ={this.state.purchasable}
                    ordered ={this.purchaseHandler}/>
            </Auxiliary>
        )
        ordersummary = <OrderSummary 
            ingredients={this.state.ingredients} 
            price={this.state.totalPrice} 
            purchaseCancelled = {this.purchaseCancelHandler}
            purchaseContinue = {this.purchaseContinueHandler}/>
        }
        if (this.state.loading) {
            ordersummary = <Spinner />;
        }
            

        return (
            <Auxiliary>
                <Modal 
                    show = {this.state.purchasing} 
                    modalClosed={this.purchaseCancelHandler}>
                    {ordersummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
}

export default withErrorHandler(Burgerbuilder,axios);