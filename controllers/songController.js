import { pool as db } from "../config/db.js";
import { validateMusic } from "../utils/validator.js";



export const getSongByArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const [song] = await db.query("SELECT * FROM music WHERE artist_id = ?", [id]);
    return res.status(200).json(song);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const [song] = await db.query("SELECT * FROM music WHERE id = ?", [id]);
    // if (song.length === 0) {
    //   return res.status(404).json({
    //     status: "error",
    //     message: "Song not found",
    //   });
    // }
    return res.status(200).json(song[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export const createSong = async (req, res) => {


  try {
    const { title, artist_id, album_name, genre } = req.body;
    const errors = validateMusic({ title, artist_id, album_name, genre });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const [song] = await db.query(
      "INSERT INTO music (title, artist_id, album_name, genre) VALUES (?, ?, ?, ?)",
      [title, artist_id, album_name, genre]
    );

    return res.status(201).json({
      message: "Song created successfully",

    });
  } catch (error) {

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, album_name, genre } = req.body;
    const [song] = await db.query(
      "UPDATE music SET title = ?, album_name = ?, genre = ? WHERE id = ?",
      [title, album_name, genre, id]
    );
    return res.status(200).json({
      message: "Song updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const removeSong = async (req, res) => {
  try {
    const { id } = req.params;
    const [song] = await db.query("DELETE FROM music WHERE id = ?", [id]);
    return res.status(200).json({
      message: "Song removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};