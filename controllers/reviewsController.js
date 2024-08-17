const Review = require("./../models/reviewsModel");

exports.getReviewsForGame = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId });
    if (!reviews) {
      return next(new AppError("No reviews found for the game.", 404));
    }
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    next(new AppError("Failed to get reviews for the game.", 500));
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create({
      ...req.body,
      gameId: req.params.gameId,
      userId: req.user.id,
    });
    res.status(201).json({
      status: "success",
      data: { review },
    });
  } catch (err) {
    next(new AppError("Failed to create a review.", 400));
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    next(new AppError("Failed to get all reviews.", 500));
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return next(new AppError("No review found with that ID.", 404));
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(new AppError("Failed to delete the review.", 500));
  }
};
