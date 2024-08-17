const { Router } = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require("./../controllers/categoriesController");
const restrictTo = require("./../middlewares/authorization");
const router = Router();

router.get("/", getAllCategories);
router.post("/", restrictTo("admin"), createCategory);
router.patch("/:id", restrictTo("admin"), updateCategory);

module.exports = router;
