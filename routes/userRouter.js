const { Router } = require("express");
const UserController = require("../Controllers/userController");
const auth=require('../middleware/auth')
const UserRouter = Router();

UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.patch("/updateUser",auth ,UserController.updateUserProfile);
module.exports = UserRouter;
