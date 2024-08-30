const { Router } = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./../controllers/categoriesController");
const restrictTo = require("./../middlewares/authorization");
const { uploadImages, handleImages } = require("../middlewares/images");
const auth = require("../middlewares/authentication");
const router = Router();

router.get("/", getAllCategories);
router.post(
  "/",
  uploadImages([{ name: "image", count: 1 }]),
  handleImages("image"),
  auth,
  restrictTo("admin"),
  createCategory
);
router.patch("/:id", auth, restrictTo("admin"), updateCategory);

router.delete("/:id", auth, restrictTo("admin"), deleteCategory);

module.exports = router;
