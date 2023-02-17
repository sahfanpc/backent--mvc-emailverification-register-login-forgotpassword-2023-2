const express = require('express');
const userRegister = require("../contoller/condrol")
const router = express.Router();
const auth = require("../middleware/middleware");
const sendmail = require('../verification/email__verify')


// ------------------------------------------------------------------------------
router.post("/register", userRegister.Register);
router.post("/login", userRegister.Login);
router.get('/test', auth, function (req, res) {
    res.status(200).send({ seccess: true, msg: "authenticated" })
});

// -----sendmail-----
router.post('/sendmail', sendmail.sendMail);



// user-verify---------------------
router.get('/verify_user', userRegister.user__verify)





// ------update password------
router.post("/update_password", userRegister.update_password);




// forgot password
router.post('/forgot_password', userRegister.forgot_password);
router.post('/Reset_password', userRegister.Reset_password);

// --------------------------------------
// --------------------------------------
// --------------------------------------
module.exports = router;