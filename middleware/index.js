const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  // check for cookie
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login first!');
  return res.redirect('/login');
};

module.exports = middlewareObj;
