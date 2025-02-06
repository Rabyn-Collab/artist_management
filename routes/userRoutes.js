import express from "express";
import { getAllUsers, getArtistsUsers, getUserById, loginUser, registerUser, removeUser, updateUser } from "../controllers/userController.js";
import { adminManagerCheck, checkUser, superAdminCheck } from "../middlewares/userCheck.js";


const router = express.Router();

// Auth routes
router.route('/login').post(loginUser);
router.route('/register').post(registerUser);


// User routes
router.route('/').get(checkUser, superAdminCheck, getAllUsers);
router.route('/artists').get(checkUser, adminManagerCheck, getArtistsUsers);
router.route('/:id').get(checkUser, getUserById).patch(updateUser).delete(checkUser, superAdminCheck, removeUser);




export default router;
