const userController = require('./controller/userController');
module.exports = function(app){
    app.post('/register',userController.create);
    app.post('/login',userController.login);
}