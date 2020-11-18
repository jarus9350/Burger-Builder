import React from 'react'
import classes from './NavigationItems.module.css'
import NavigationItem from './NavigationItem/NavigationItem'
const navigationItems = () => (
    <ul className={classes.Navigationitems }>
        <NavigationItem link="/"
        //for boolen props we can write like below "active" props rather than active={true}
         active>Burger Builder</NavigationItem>
        <NavigationItem link="/">Checkout</NavigationItem>
    </ul>
)

export default navigationItems;