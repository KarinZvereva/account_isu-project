const express = require('express')
const passport = require('passport')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000);

app.set('views','./views')
app.set('view engine','pug')
app.use(express.static("public"));
app.use(expressSession({
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true
}));

require('./public/scripts/passport.js')(app,passport);

app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./public/scripts/routers.js')(app,passport);
require('./public/scripts/chat_file.js')(io,app);
require('./public/scripts/profiles.js')(app);


