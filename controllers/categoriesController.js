const Category = require("./../models/categoriesModel");
const AppError = require("./../utils/AppError");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories) new AppError("Cannot find categories", 404);
    res.status(200).send({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).send({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return next(new AppError("Category not found", 404));
    res.status(200).send({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    next(err);
  }
};
