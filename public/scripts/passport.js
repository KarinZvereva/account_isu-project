const LocalStrategy = require('passport-local').Strategy;
const mysql  = require('mysql');
var path = require('path');
const bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'accountisu'
  });

module.exports = function(app, passport){

    app.use(bodyParser.urlencoded({ extended: false }));

    var user={}

    app.post('/getuser',(req,res)=>{
            res.send(user);   
        });

    
    passport.serializeUser(function(user, done) {
        done(null, user.username);
      });
      
    passport.deserializeUser(function(username, done) { 
        var user ={}
        connection.query("SELECT username,password,role FROM users where username='"+username+"'",function(err, rows, fields) {
            
            if(rows[0]){
                user={
                    username:rows[0].username,
                    password:rows[0].password,
                    role:rows[0].role
                }}
                if (user.username == username) {  
                    return done(null,user);}
                done(null, false);
            }); 
      });

      passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
        }, (req,username,password,done)=>{
        var message = "Неправильный Логин или Пароль!";
        //connection.connect(); 
		
        connection.query("SELECT username,password,role FROM users where username='"+username+"' AND password='"+password+"'",function(err, rows, fields) {
      		 if (rows && rows[0])
                user={
      			  username: rows[0].username,
                    password: rows[0].password,
      			  role:rows[0].role
      		  }
		  
            if(!(user.username == username)){
               return done(null,false,req.flash('message', message),req.flash('class', 'wrong'));
            }
            if(!(user.password == password)){
                return done(null,false,req.flash('message',message),req.flash('class', 'wrong'));
            }
           return done(null,user);
        });
		//connection.end();
        
		
    }));
}

