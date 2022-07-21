
module.exports = function(app) {
    const school = require('./schoolController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //회사 검색 API
    app.get('/app/schools', school.getSchools);
}