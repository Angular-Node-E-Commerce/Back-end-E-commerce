const { Router } = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require("./../controllers/categoriesController");
const restrictTo = require("./../middlewares/authorization");
const { uploadImages, handleImages } = require("../middlewares/images");
const auth = require("../middlewares/authentication");
const router = Router();

router.get("/", getAllCategories);
router.post(
  "/",
  uploadImages([{ name: "catImage", count: 1 }]),
  handleImages("catImage"),
  auth,
  restrictTo("admin"),
  createCategory
);
router.patch("/:id", auth, restrictTo("admin"), updateCategory);

module.exports = router;
