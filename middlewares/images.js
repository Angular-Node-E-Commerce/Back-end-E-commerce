const multer = require("multer");
const fs = require("fs");
const path = require("path");
const AppError = require("../utils/AppError");

const multerStorage = multer.memoryStorage();

const multerFilterImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image , plz enter image only ."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilterImage,
});
//

exports.uploadImages = (fields) => {
  return upload.fields([
    ...fields.map((field) => ({ name: field.name, maxCount: field.count })),
  ]);
};

exports.handleImages = (fieldname) => {
  return async (req, res, next) => {
    const files = req.files[fieldname];

    if (!files) return next();

    const directory = path.join(__dirname, "../public/img");
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    try {
      const processedFiles = await Promise.all(
        files.map(async (file, i) => {
          const filename = `api-${Date.now()}-${i + 1}.jpeg`;
          const filePath = path.join(directory, filename);

          fs.writeFileSync(filePath, file.buffer);

          return { filename, path: filePath };
        })
      );
      req.body[fieldname] = processedFiles.map((file) => file.filename);
      next();
    } catch (error) {
      return next(new AppError("Error processing images", 400));
    }
  };
};
