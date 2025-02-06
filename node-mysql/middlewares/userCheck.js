import jwt from 'jsonwebtoken';


export const checkUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'you are not authorised' });

  const decode = jwt.decode(token, 'secret');
  if (!decode) return res.status(401).json({ message: 'you are not authorised' });

  req.userId = decode.id;
  req.role = decode.role;
  next();
}

export const superAdminCheck = (req, res, next) => {
  if (req.role !== 'super_admin') return res.status(401).json({ message: 'you are not authorised' });
  next();
}

export const adminManagerCheck = (req, res, next) => {
  if (req.role === 'artist_manager' || req.role === 'super_admin') {
    return next();
  } else {
    return res.status(401).json({ message: 'you are not authorised' });
  }

}

export const artistManagerCheck = (req, res, next) => {
  if (req.role !== 'artist_manager') return res.status(401).json({ message: 'you are not authorised' });
  next();
}

export const artistCheck = (req, res, next) => {
  if (req.role !== 'artist') return res.status(401).json({ message: 'you are not authorised' });
  next();
}