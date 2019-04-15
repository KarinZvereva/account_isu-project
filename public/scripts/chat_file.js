var mysql  = require('mysql');
var path = require('path');
var parse = require("./parseUP");
const multer = require('multer')
var upload = multer().single('file');
const bodyParser = require('body-parser');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'accountisu'
});

var users = [];


module.exports = function(io, app) {

io.on('connection', (socket) => {
  var addedUser = false;
  
   socket.on('new message', (data, friend) => {
    console.log(friend)
    result = users.filter(e => e.username===friend);
    if (result && result[0]) 
    socket.broadcast.to(result[0].id).emit('new message', {
      	username: socket.username,
      	message: data
    });
   	
    socket.broadcast.to(socket.id).emit('new message', {
      username: socket.username,
      message: data
    });
     
    // socket.broadcast.emit('new message', {
    //   username: socket.username,
    //   message: data
    // });
  });

 
  socket.on('add user', (username) => {
    if (addedUser) return;
    socket.username = username;
    users.push({"username": username, "id":socket.id});
    addedUser = true;
    console.log(users)
    socket.emit('login');
    
    // socket.broadcast.emit('user joined', {
    //   username: socket.username,
    //   numUsers: numUsers
    // });
  });

   socket.on('typing', (friend) => {
  	result = users.filter(e => e.username===friend);
    if (result && result[0])
    socket.broadcast.to(result[0].id).emit('typing', {
      username: socket.username
    });

	socket.broadcast.to(socket.id).emit('typing', {
      username: socket.username
    });

  });

  
  socket.on('stop typing', (friend) => {
  	result = users.filter(e => e.username===friend);
    if (result && result[0]) {
    socket.broadcast.to(result[0].id).emit('stop typing', {
      username: socket.username
    });
    }
    socket.broadcast.to(socket.id).emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('disconnect', () => {
    if (addedUser) {
    	users.splice(users.findIndex(e => e.id === socket.id),1);
      // echo globally that this client has left
      // socket.broadcast.emit('user left', {
      //   username: socket.username,
      //   numUsers: numUsers
      // });
    }
  });
});

connection.connect();
var dirs = [];



app.get('/msg', (req, res) => {
	connection.query("SELECT * FROM users order by surname", function(err, rows, fields) {
		res.render('msg', {mas: rows})
	});	
});

app.get('/up', (req, res) => {	
	connection.query("SELECT * FROM directions order by code", function(err, rows, fields) {
		dirs = rows;
	});	
	connection.query("SELECT year FROM dis group by year", function(err, rows, fields) {
		res.render('up', {dirs: dirs, masy:rows, user:req.user.username});
	});	
	
});

app.get('/up/teacher', (req, res) => {  
  connection.query("SELECT * FROM directions order by code", function(err, rows, fields) {
    dirs = rows;
  }); 
  connection.query("SELECT year FROM dis group by year", function(err, rows, fields) {
    res.render('up_teacher', {dirs: dirs, masy:rows, user:req.user.username});
  }); 
  
});

app.post('/up/show', (req, res) => {	
	result = dirs.filter(item => (item.code+" "+item.direction)==(req.body.dir));	
	if (result!=undefined)
		id = result[0].id;
	connection.query("SELECT * FROM dis WHERE dir_id="+id+" AND year="+req.body.year+" ORDER BY sem", function(err, rows, fields) {
		res.send(rows)
	});	
});


var buff;
var dir;
app.post('/load/a', (req, res) => {
	if (req.body.dir!="Выберите направление подготовки") {
	upload(req, res, (err)=> {
		if (req.file) {
	 		buff = req.file.buffer;
	 		dir = req.body.dir;
	 		var result;

	 	parse.beforeParse(req.file.buffer, function(r) {
  				result = r
 	 	});	
		
		return res.end(result[0].spec +" "+ result[0].year);
	 	}
 	
	});	
	}
	else res.end(0)
});

app.post('/load/sub', (req, res) => {
	var up;
	
	parse.parseUP(buff, function(res) {
					up = res;
	})
				
	result = dirs.filter(item => item.code+" "+item.direction==dir);	
	if (result[0]==undefined) res.end("Ошибка!")	
	else  {
		id = result[0].id;
	
	connection.query("DELETE from dis WHERE year="+up[0].year+" AND dir_id="+id)
	for (var i=0; i< up.length; i++) 
		connection.query("INSERT INTO dis (year, dir_id, dis, choise, sem, lek, pr, lab, control) VALUES"+
			"("+up[i].year+","+id+",'"+up[i].dis+"',"+up[i].choise+","+up[i].sem+",'"+up[i].lek+"','"+up[i].pr+"','"+up[i].lab+"','"+up[i].control+"')", 
		function(err, rows, fields) {
			if (err) throw err;
		});	
	res.end("Успешно")
	}
});
}



