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
    const [rows] = await db.query("SELECT * FROM artist WHERE user_id = ?", [id]);
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
    const expectedColumns = ['name', 'dob', 'gender', 'address', 'first_release_year', 'no_of_albums_released', 'user_id'];
    const fileRows = [];
    let headersValidated = false;
    let validationErrors = [];

    const stream = fs.createReadStream(req.filePath)
      .pipe(fastCsv.parse({ headers: true }))
      .on('headers', (headers) => {
        // Validate CSV headers
        const isValidColumns = expectedColumns.every(col => headers.includes(col));
        if (!isValidColumns) {
          validationErrors.push('Invalid CSV format. Missing or extra columns detected.');
        }
        headersValidated = isValidColumns;
      })
      .on('data', (row) => {
        if (!headersValidated) return; // Skip rows if headers are invalid

        // Row Validation
        const artistName = row.name?.trim() || null;

        // Validate dob (expecting format YYYY-MM-DD)
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        let dob = null;
        if (row.dob) {
          const trimmedDob = row.dob.trim();
          if (dobRegex.test(trimmedDob)) {
            dob = trimmedDob;
          } else {
            // If not in the correct format, try to parse it manually (e.g., for date strings like "Fri Feb 07 2025...")
            const parsedDob = new Date(trimmedDob);
            if (!isNaN(parsedDob.getTime())) {
              dob = parsedDob.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
            }
          }
        }

        // Validate gender
        const gender = ['m', 'f', 'o'].includes(row.gender?.trim().toLowerCase()) ? row.gender.trim().toLowerCase() : null;

        // Validate address
        const address = row.address?.trim() || null;

        // Ensure first_release_year is a valid 4-digit year
        const firstReleaseYear = row.first_release_year && /^\d{4}$/.test(row.first_release_year.trim())
          ? parseInt(row.first_release_year.trim())
          : null;

        // Ensure albumsReleased is a valid number (default to 0 if missing)
        const albumsReleased = row.no_of_albums_released && /^\d+$/.test(row.no_of_albums_released.trim())
          ? parseInt(row.no_of_albums_released.trim())
          : 0;

        // Ensure userId is a valid number
        const userId = row.user_id && /^\d+$/.test(row.user_id.trim())
          ? parseInt(row.user_id.trim())
          : req.user.id; // Use CSV user_id if provided, else fallback to logged-in user

        // Validate required fields
        if (!artistName || !dob || !gender || !address || !firstReleaseYear || userId == null) {
          validationErrors.push(`Invalid data in row: ${JSON.stringify(row)}`);
        } else {
          fileRows.push([artistName, dob, gender, address, firstReleaseYear, albumsReleased, userId]);
        }
      })
      .on('end', async () => {
        console.log("Validation Errors:", validationErrors);

        fs.unlink(req.filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });

        if (validationErrors.length > 0) {
          return res.status(400).json({ message: `${validationErrors}`, errors: validationErrors });
        }

        if (fileRows.length === 0) {
          return res.status(400).json({ message: 'No valid artist data found in CSV.' });
        }

        // Insert into DB
        const sql = 'INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released, user_id) VALUES ?';
        try {
          const [result] = await db.query(sql, [fileRows]);
          res.json({ message: 'CSV imported successfully', insertedRows: result.affectedRows });
        } catch (err) {
          console.error("Database Insertion Error:", err);
          res.status(500).json({ message: err.message });
        }
      })
      .on('error', (err) => {
        console.error("CSV Processing Error:", err);
        fs.unlink(req.filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });

        res.status(500).json({ message: 'Error processing CSV file', error: err.message });
      });

  } catch (err) {
    console.error("Unexpected Server Error:", err);
    fs.unlink(req.filePath, (unlinkErr) => {
      if (unlinkErr) console.error('Error deleting file:', unlinkErr);
    });

    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};



export const csvArtistExport = async (req, res) => {
  try {
    // Query to fetch all artist data using async/await
    const sql = 'SELECT name, dob, gender, address, first_release_year, no_of_albums_released, user_id FROM artist';

    // Using promise-based query
    const [result] = await db.query(sql);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No artist data found in the database.' });
    }

    // Create a writable stream to output the CSV file
    const filePath = './uploads/artists_export.csv';
    const ws = fs.createWriteStream(filePath);

    // Use fastCsv to write the artist data to the file
    fastCsv
      .write(result, { headers: true })
      .pipe(ws)
      .on('finish', () => {
        // Send the CSV file as a downloadable response
        res.download(filePath, 'artists_export.csv', (err) => {
          if (err) {
            console.error('Error sending CSV file:', err);
            return res.status(500).json({ message: 'Error sending CSV file', error: err.message });
          }

          // Clean up the temporary file after sending it
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting CSV file:', unlinkErr);
            }
          });
        });
      })
      .on('error', (err) => {
        console.error('Error writing CSV file:', err);
        return res.status(500).json({ message: 'Error writing CSV file', error: err.message });
      });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'Error exporting artists to CSV', error: err.message });
  }
};