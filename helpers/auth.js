module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } 
    req.flash('error_msg', 'Aucune autorisation');
    res.redirect('/users/login');
  }
}