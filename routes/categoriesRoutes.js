const { Router } = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require("./../controllers/categoriesController");
const router = Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.patch("/:id", updateCategory);

module.exports = router;
