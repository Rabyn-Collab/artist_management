import express from "express";
import { createSong, getSongByArtist, getSongById, removeSong, updateSong } from "../controllers/songController.js";
import { artistCheck, checkUser } from "../middlewares/userCheck.js";



const router = express.Router();

// Song routes
router.route('/').post(checkUser, artistCheck, createSong);
router.route('/artists/:id').get(getSongByArtist);
router.route('/:id').get(getSongById).patch(checkUser, artistCheck, updateSong).delete(checkUser, artistCheck, removeSong);

export default router;