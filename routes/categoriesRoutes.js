const { Router } = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require("./../controllers/categoriesController");
const restrictTo = require("./../middlewares/authorization");
const router = Router();

router.get("/", getAllCategories);
router.post("/", uploadImages([{ name: "catImage", count: 1 }]),
handleImages("catImage"),restrictTo("admin"), createCategory);
router.patch("/:id", restrictTo("admin"), updateCategory);

module.exports = router;
