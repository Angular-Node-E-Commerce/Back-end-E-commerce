const Category = require("./../models/categoriesModel");
const AppError = require("./../utils/AppError");

exports.getAllCategories = async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) new AppError("Cannot find categories", 404);
  res.status(200).send({
    status: "success",
    data: {
      categories,
    },
  });
};

exports.createCategory = async (req, res, next) => {
  let image;
  if (req.body.image) image = req.body.image[0];
  const newCategory = await Category.create({ ...req.body, image });
  if (!newCategory) throw new AppError("Error creating category", 400);
  res.status(201).send({
    status: "success",
    data: {
      category: newCategory,
    },
  });
};

exports.updateCategory = async (req, res, next) => {
  if (Object.entries(req.body).length === 0) {
    throw new AppError("55555555555555555555", 400);
  }
  let image;
  if (req.body.image) image = req.body.image[0];
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { ...req.body, image },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) return next(new AppError("Category not found", 404));
  res.status(200).send({
    status: "success",
    data: {
      category,
    },
  });
};

exports.deleteCategory = async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError("Category not found", 404);
  res.status(204).send();
};
