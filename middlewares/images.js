const multer= require("multer");
const fs =require("fs");
const path = require("path");
const AppError = require("../utils/AppError");

const multerStorage=multer.memoryStorage();

const multerFilterImage=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true);
    }else{
        cb (new Error ("Not an image , plz enter image only ."),false);
    };
};

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilterImage,
});
//

exports.uploadImages=(fields) => {
    return upload.fields([...fields.map((field)=> ({ name: field.name, maxCount: field.count }) )]);
};
exports.uploadSingleImage=(name) => {
    return upload.single(name);
};

exports.handleImages = (fieldname) => {
    return async (req, res, next) => {
      const isSingleUpload = req.file != null;
      const files = isSingleUpload ? [req.file] : req.files[fieldname];
  
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
  
        if (isSingleUpload) {
          req.file.filename = processedFiles[0].filename;
          req.file.path = processedFiles[0].path;
        } else {
          req.body[fieldname] = processedFiles.map((file) => file.filename);
        }
  
        next();
      } catch (error) {
        return next(new AppError("Error processing images",400));
      }
    };
  };
  