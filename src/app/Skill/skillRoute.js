module.exports = function(app){
    const skill = require('./skillController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    app.get('/app/skills/:skillname',skill.getSkills);


};

