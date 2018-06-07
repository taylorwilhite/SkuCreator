var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	//check for cookie
	if(req.session.TenantToken){
		return next();
	} else {
		console.log('You need to be logged in');
		res.redirect('/login');
	};
};

module.exports = middlewareObj;