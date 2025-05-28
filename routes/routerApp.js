const express = require('express');
const router = express.Router();

const indexRouter = require('./index');
const registerRouter = require('./register');
const loginRouter = require('./login');
const userRouter = require('./user');
const addToCartRouter = require('./add-item');
const removeFromCartRouter = require('./remove-item');
const getCartRouter = require('./cart');
const checkoutRouter = require('./checkout');
const logoutRouter = require('./logout');


// Defined Routes
router.use('/', indexRouter);//root
router.use('/register', registerRouter);//register
router.use('/login', loginRouter);//login
router.use('/user', userRouter);//user profile
router.use('/add-item', addToCartRouter);//adding to cart
router.use('/remove-item', removeFromCartRouter);//remove from cart
router.use('/cart', getCartRouter);//get items for cart
router.use('/checkout', checkoutRouter);//checkout
router.use('/logout', logoutRouter);// logout

module.exports = router;