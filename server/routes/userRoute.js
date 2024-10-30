const express = require("express");
const { createuser, getLocalAgents,getUser, getUserById, getUserByMetamaskId } = require("../controllers/userController");

const router = express.Router();

router.route("/createUser").post(createuser);
router.route("/getAgents").get(getLocalAgents);
router.route("/getuser/:id").get(getUser)
router.route("/getUserById/:id").get(getUserById)
router.route("/getUserByMetamaskId/:id").get(getUserByMetamaskId)
module.exports = router;

