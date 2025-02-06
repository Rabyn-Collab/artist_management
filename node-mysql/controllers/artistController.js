import { pool as db } from "../config/db.js";
import { validateArtist } from "../utils/validator.js";
import fs from "fs";
import csvParser from "csv-parser";


export const createArtist = async (req, res) => {
  // Validate the request body
  const { error, value } = validateArtist(req.body);
  if (error) return res.status(400).json(error.details);

  try {
    const { name, dob, gender, address, first_release_year, no_of_albums_released, user_id } = req.body;
    const dobFormatted = new Date(dob).toISOString().split('T')[0];
    const [rows] = await db.query(
      'INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, dobFormatted, gender, address, first_release_year, no_of_albums_released, user_id]
    );

    return res.status(201).json(
      {
        message: "Artist created successfully",

      }
    );
  } catch (err) {


    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

}


export const csvArtistCreate = async (req, res) => {
  try {


    const artists = [];

    // Read CSV File
    const fileStream = fs.createReadStream(req.filePath)
      .pipe(csvParser());

    for await (const row of fileStream) {
      const userId = parseInt(row.user_id, 10);
      const firstReleaseYear = row.first_release_year ? parseInt(row.first_release_year, 10) : null;
      const noOfAlbumsReleased = row.no_of_albums_released ? parseInt(row.no_of_albums_released, 10) : 0;

      if (!row.name || isNaN(userId)) {
        console.error("Skipping invalid row:", row);
        continue;
      }

      artists.push([
        row.name,
        row.dob || null,
        row.gender || "Unknown",
        row.address || "Unknown",
        firstReleaseYear,
        noOfAlbumsReleased,
        userId,
      ]);
    }

    // Check if there are valid artists to insert
    if (artists.length === 0) {
      return res.status(400).json({ message: "No valid data to import" });
    }

    const sql = `INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, user_id) VALUES ?`;

    try {
      await pool.query(sql, [artists]);
      res.status(200).json({ message: "Artists imported successfully", inserted: artists.length });
    } catch (error) {
      console.error("Database Insert Error:", error);
      res.status(500).json({ message: "Error inserting artists into database", error: error.message });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}



export const getAllArtists = async (req, res) => {
  try {
    const id = req.userId;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const offset = (page - 1) * limit;

    // Get total count of artists

    const [totalRows] = await db.query(`SELECT COUNT(*) AS total FROM artist`, [id]);
    const totalArtists = totalRows[0].total;
    const totalPages = Math.ceil(totalArtists / limit);

    // Fetch paginated artists
    const [rows] = await db.query(
      `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released, user_id 
       FROM artist 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return res.status(200).json({ page, limit, totalArtists, totalPages, users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM artist WHERE user_id = ?", [id]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}


export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, dob, gender, address, first_release_year, no_of_albums_released } = req.body;
    const [rows] = await db.query(
      'UPDATE user SET name = ?, password = ?, dob = ?, gender = ?, address = ?, first_release_year = ?, no_of_albums_released = ?, updated_at = NOW() WHERE id = ?',
      [name, password, dob, gender, address, first_release_year, no_of_albums_released, id]
    );
    return res.status(200).json(rows);
  } catch (err) {

    return res.status(500).json({
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

export const removeArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('DELETE FROM user WHERE id = ?', [id]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}