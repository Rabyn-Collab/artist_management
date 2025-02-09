import { pool as db } from "../config/db.js";
import { validateLogin, validateRegister } from "../utils/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Determine if input is an email or phone (10 digits)
    let query = '';
    let queryParams = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // Only 10-digit phone numbers

    if (emailRegex.test(emailOrPhone)) {
      // If it's an email, search by email
      query = 'SELECT * FROM user WHERE email = ?';
      queryParams = [emailOrPhone];
    } else if (phoneRegex.test(emailOrPhone)) {
      // If it's a 10-digit phone number, search by phone
      query = 'SELECT * FROM user WHERE phone = ?';
      queryParams = [emailOrPhone];
    } else {
      return res.status(400).json({
        message: 'Invalid email or phone number format'
      });
    }

    const [rows] = await db.query(query, queryParams);
    if (rows.length === 0) {
      return res.status(400).json({
        message: 'User not found'
      });
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid password'
      });
    }

    // 3. Create a token
    const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, process.env.JWT_SECRET);

    // 4. Send the token in the response
    return res.status(200).json({
      data: {
        role: rows[0].role,
        token,
        id: rows[0].id
      }
    });

  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
};



export const registerUser = async (req, res) => {
  // Validate the request body
  const { error, value } = validateRegister(req.body);
  if (error) return res.status(400).json(error.details);

  try {
    const { first_name, last_name, email, password, phone, dob, gender, address, role } = req.body;
    const formattedDob = new Date(dob).toISOString().split('T')[0];

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. It must be 10 digits.' });
    }
    //Check if the email is already registered
    const [existingUser] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'user already exists' });
    }

    const [existingPhone] = await db.query('SELECT * FROM user WHERE phone = ?', [phone]);
    if (existingPhone.length > 0) {
      return res.status(400).json({ message: 'User with this phone number already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await db.query(
      'INSERT INTO user (first_name, last_name, email, password, phone, dob, gender, address, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [first_name, last_name, email, hashedPassword, phone, formattedDob, gender, address, role ?? 'super_admin']
    );

    // Respond with the token
    res.status(201).json({
      message: 'User registered successfully.',
    });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const id = req.userId;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const offset = (page - 1) * limit;

    // Get total count of users (excluding current user, artists, and users in artist table)
    const [totalRows] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM user u
       WHERE u.id != ? 
       AND NOT EXISTS (SELECT 1 FROM artist a WHERE a.user_id = u.id)`,
      [id]
    );
    const totalUsers = totalRows[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    // Fetch paginated users (excluding current user, artists, and users in artist table)
    const [rows] = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.dob, 
      u.gender, u.address, u.role 
       FROM user u
       WHERE u.id != ? 
       AND NOT EXISTS (SELECT 1 FROM artist a WHERE a.user_id = u.id) 
       ORDER BY u.created_at DESC 
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    return res.status(200).json({
      page,
      limit,
      totalUsers,
      totalPages,
      users: rows,
    });

  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
};



export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Exclude the password field
    const [rows] = await db.query(
      "SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at FROM user WHERE id = ?",
      [id]
    );

    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, dob, gender, address } = req.body;
    const formattedDob = new Date(dob).toISOString().split('T')[0];

    const [rows] = await db.query(
      'UPDATE user SET first_name = ?, last_name = ?, dob = ?, gender = ?, address = ?, updated_at = NOW() WHERE id = ?',
      [first_name, last_name, formattedDob, gender, address, id]
    );
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('DELETE FROM user WHERE id = ?', [id]);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
};


export const getArtistsUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.dob, 
      u.gender, u.address, u.role 
      FROM user u
      WHERE u.role = 'artist' 
      AND NOT EXISTS (
        SELECT 1 FROM artist a WHERE a.user_id = u.id
      )
    `);

    return res.status(200).json(rows);
  } catch (err) {
    return res.status(400).json({
      message: `${err}`
    });
  }
};


