const { Router } = require("express");
const {
  getAllReviews,
  deleteReview,
  getReviewsForGame,
  createReview,
} = require("../controllers/reviewsController");
const auth = require("../middlewares/authentication");
const restrictTo = require("../middlewares/authorization.js");

const router = Router({ mergeParams: true });

router.get("/", auth, restrictTo("admin"), getAllReviews);
router.delete("/:id", auth, restrictTo("admin"), deleteReview);
router.post("/", auth, restrictTo("user"), createReview);
router.get("/:id", getReviewsForGame);

module.exports = router;
