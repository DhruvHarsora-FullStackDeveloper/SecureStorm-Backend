import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import * as userController from "../controller/userController.js";

const router = new express.Router();

router.post("/signup", userController.userSignUp);

router.post("/login", userController.userLogin);

router.patch("/:id", userAuth, userController.userUpdate);

router.patch("/masterkey/:id", userAuth, userController.updateMasterKey);

router.patch("/password/:id", userAuth, userController.updatePassword);

router.delete("/:id", userAuth, userController.deleteUser);

export default router;
