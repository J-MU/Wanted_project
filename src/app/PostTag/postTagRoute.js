module.exports = function(app){
    const postTag = require('./postTagController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

   app.get('/app/post-tags',postTag.getTags);

};