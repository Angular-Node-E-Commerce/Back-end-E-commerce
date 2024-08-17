const restrictTo = (role) => {
  return async (req, res, next) => {
    console.log(req.user);
    if (req.user?.role === role) return next();
    res.status(403).send({ message: "Not authorized" });
  };
};

module.exports = restrictTo;
