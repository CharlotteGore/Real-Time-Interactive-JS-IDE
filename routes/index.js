
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.iframeEmpty = function(req, res){
	res.render('iframe_empty', {layout : false, script : "/" + req.params[0] + ".js"});

}