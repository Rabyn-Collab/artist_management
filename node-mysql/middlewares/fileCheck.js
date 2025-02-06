import path from 'path';
const csvExtensions = ['.csv'];

export const checkFile = (req, res, next) => {
  const file = req.files?.csv;
  console.log(req.files);

  if (file) {

    if (!csvExtensions.includes(path.extname(file.name))) {
      return res.status(400).json({ message: 'invalid file type' });
    }
    console.log(file);
    const filePath = `./uploads/${file.name}`;
    file.mv(filePath, (err) => {
      if (err) return res.status(500).json({ message: err });
      req.filePath = filePath;
      return next();
    });

  } else {
    return res.status(400).json({ message: 'please provide valid file' });
  }
}

