const express = require('express');//Import express
const router = express.Router(); //Created router instance and save it to variable


// Logout route for finishing user session
router.get('/', (req, res) => {
    req.session.destroy((err) => {
        return res.redirect('/');
    });
});

module.exports = router;
