var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	//check for cookie
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first!");
	res.redirect("/login");
};

module.exports = middlewareObj;