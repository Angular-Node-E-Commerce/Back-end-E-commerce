const { Router } = require("express");
const {
  getAllReviews,
  deleteReview,
  getReviewsForGame,
  createReview,
} = require("../controllers/reviewsController");
const auth = require("../middlewares/authentication");

const router = Router({ mergeParams: true });

router.get("/", auth, getAllReviews);
router.delete("/:id", auth, deleteReview);
router.post("/", auth, createReview);
router.get("/:id", getReviewsForGame);

module.exports = router;
