import { pool as db } from "../config/db.js";
import { validateArtist } from "../utils/validator.js";
import fs from "fs";
import * as fastCsv from 'fast-csv';


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

    return res.status(400).json({
      message: `${err}`
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
    return res.status(400).json({
      message: `${err}`
    });
  }
};


export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM artist WHERE id = ?", [id]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
}






export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, gender, address, first_release_year, no_of_albums_released } = req.body;
    const formattedDob = new Date(dob).toISOString().split('T')[0];
    const [rows] = await db.query(
      'UPDATE artist SET name = ?, dob = ?, gender = ?, address = ?, first_release_year = ?, no_of_albums_released = ?, updated_at = NOW() WHERE id = ?',
      [name, formattedDob, gender, address, first_release_year, no_of_albums_released, id]
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
}

export const removeArtist = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('DELETE FROM artist WHERE id = ?', [id]);
    return res.status(200).json({
      message: "Artist removed successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
}



export const csvArtistCreate = async (req, res) => {
  try {
    const fileRows = [];
    const expectedColumns = ['name', 'dob', 'gender', 'address', 'first_release_year', 'no_of_albums_released'];

    // Flag to check if a response has already been sent
    let responseSent = false;

    fs.createReadStream(req.filePath)
      .pipe(fastCsv.parse({ headers: true }))
      .on('data', (row) => {
        // Column Validation: Ensure that all required columns are present in the CSV
        const columns = Object.keys(row);
        const isValidColumns = expectedColumns.every(col => columns.includes(col));

        if (!isValidColumns && !responseSent) {
          fs.unlinkSync(req.filePath);
          responseSent = true; // Mark response as sent
          return res.status(400).json({ message: 'Invalid CSV format. Missing or extra columns detected.' });
        }

        // Row Validation: Ensure correct data format
        const artistName = row.name || null;
        const dob = row.dob && !isNaN(Date.parse(row.dob)) ? row.dob : null; // Check if dob is a valid date
        const gender = ['m', 'f', 'o'].includes(row.gender) ? row.gender : null; // Check if gender is valid
        const address = row.address || null;
        const firstReleaseYear = row.first_release_year && !isNaN(parseInt(row.first_release_year)) ? parseInt(row.first_release_year) : null; // Check if valid number
        const albumsReleased = row.no_of_albums_released && !isNaN(parseInt(row.no_of_albums_released)) ? parseInt(row.no_of_albums_released) : null; // Check if valid number

        // If any field is invalid, reject the row
        if (!artistName || !dob || !gender || !address || !firstReleaseYear || !albumsReleased) {
          if (!responseSent) {
            responseSent = true; // Mark response as sent
            return res.status(400).json({ message: `Invalid data in row: ${JSON.stringify(row)}` });
          }
        }

        // Add the validated row data
        fileRows.push([
          artistName,
          dob,
          gender,
          address,
          firstReleaseYear,
          albumsReleased,
          req.user.id // Assuming that the logged-in user (artist_manager) is the one assigning the artist
        ]);
      })
      .on('end', () => {
        fs.unlinkSync(req.filePath); // Remove the temporary file after processing

        // If no valid rows were found, send an error
        if (fileRows.length === 0 && !responseSent) {
          responseSent = true; // Mark response as sent
          return res.status(400).json({ message: 'No valid artist data found in CSV.' });
        }

        // Insert the artists into the Artist table
        const sql = 'INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, user_id) VALUES ?';
        db.query(sql, [fileRows], (err, result) => {
          if (err) {
            if (!responseSent) {
              responseSent = true; // Mark response as sent
              return res.status(500).json({ message: 'Error processing CSV file', error: err.message });
            }
          }
          if (!responseSent) {
            responseSent = true; // Mark response as sent
            res.json({ message: 'CSV imported successfully', insertedRows: result.affectedRows });
          }
        });
      })
      .on('error', (err) => {
        // Handle errors during CSV parsing
        if (!responseSent) {
          responseSent = true; // Mark response as sent
          return res.status(500).json({ message: 'Error processing CSV file', error: err.message });
        }
      });
  } catch (err) {
    // Ensure response is sent only once in case of an error
    if (!responseSent) {
      responseSent = true; // Mark response as sent
      return res.status(400).json({ message: `${err}` });
    }
  }
}




export const csvArtistExport = async (req, res) => {
  try {
    // Query to fetch all artist data
    const sql = 'SELECT name, dob, gender, address, first_release_year, no_of_albums_released FROM artist';
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching artist data', error: err.message });
      }

      // Create a writable stream to output the CSV file
      const filePath = './tmp/artists_export.csv';
      const ws = fs.createWriteStream(filePath);

      // Use fastCsv to write the artist data to the file
      fastCsv
        .write(result, { headers: true })
        .pipe(ws)
        .on('finish', () => {
          // Once the file is created, send it as a response
          res.download(filePath, 'artists_export.csv', (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error sending CSV file', error: err.message });
            }

            // Clean up the temporary file after sending it
            fs.unlinkSync(filePath);
          });
        })
        .on('error', (err) => {
          return res.status(500).json({ message: 'Error writing CSV file', error: err.message });
        });
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error exporting artists to CSV', error: err.message });
  }
};