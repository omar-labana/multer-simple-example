const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
//
const app = express();
//
const storage = multer.diskStorage({
  destination: "./public/imgs/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
//
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("image");
//
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
//
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.get("*", (req, res) => {
  res.render("mainView");
});
//
app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("mainView", {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render("mainView", {
          msg: "Error: No File Selected!"
        });
      } else {
        res.render("mainView", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});
//
const port = 3000;
app.listen(port, () => console.log(`Eyes on port ${port}`));
