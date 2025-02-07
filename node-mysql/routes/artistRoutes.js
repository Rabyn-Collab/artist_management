import express from 'express';
import { createArtist, csvArtistCreate, csvArtistExport, getAllArtists, getArtistById, removeArtist, updateArtist } from '../controllers/artistController.js';
import { adminManagerCheck, artistManagerCheck, checkUser } from '../middlewares/userCheck.js';
import { checkFile } from '../middlewares/fileCheck.js';


const router = express.Router();

// Artist routes
router.route('/').get(checkUser, adminManagerCheck, getAllArtists).post(checkUser, artistManagerCheck, createArtist);
router.route('/upload-csv').post(checkUser, artistManagerCheck, checkFile, csvArtistCreate);
router.route('/export-artists').get(checkUser, artistManagerCheck, csvArtistExport);
router.route('/:id').get(getArtistById).patch(checkUser, adminManagerCheck, updateArtist).delete(checkUser, artistManagerCheck, removeArtist);


export default router;