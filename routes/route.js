const express = require('express');
const userRegister = require("../contoller/condrol")
const router = express.Router();
// 
const auth = require("../middleware/middleware")
// 
// create routes
router.post("/register", userRegister.Register);
router.post("/login", userRegister.Login);
router.get('/test', auth, function (req, res) {
    res.status(200).send({ seccess: true, msg: "authenticated" })
});
module.exports = router;