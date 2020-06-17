const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  // check for cookie
  if (req.isAuthenticated() && req.user.isSupplier === false) {
    return next();
  }
  req.flash('error', 'Please login first!');
  return res.redirect('/login');
};

middlewareObj.isSupplier = (req, res, next) => {
  if (req.isAuthenticated && req.user.isSupplier === true) {
    return next();
  }
  req.flash('error', 'You are not logged in as supplier');
  return res.redirect('/login');
}

module.exports = middlewareObj;
