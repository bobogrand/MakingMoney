var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');


var client = mysql.createConnection({
	user : 'root',
	password : 'qwe123',
	database : 'capestone2_db'
});


app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.listen(8000,function(){
	console.log('running at 8000');
});


// ABOUT


//bootstrap
app.use(express.static(__dirname+'/public'));
// use Morgan : info  get, post 
app.use(morgan('combined'));


// INDEX
app.get('/',function(req,res){
	console.log(__dirname);
	fs.readFile('./index.html','utf8',function(err,html){
			res.writeHeader(200,{'content-type':'text/html'});
			res.end(ejs.render(html,{
				strname1 : '한강 자전거길, 선유도공원을 경유하여...',
				reviews1 : 4,
				strname2 : '남양주시를 끼고 도는 자전거길, 동창회 모임과 당일치기 여행으로 추천',
				reviews2 : 7,
				strname3 : '다소 거친 경로이지만 하회탈 축제와 함께 즐길 수 있는 경로',
				reviews3 : 10,
				strname4 : '전주 한옥마을을 경유하는 자전거 경로. 초보자에게 추천',
				reviews4 : 1,
				strname5 : '추천 글귀를 올려주세요!',
				reivews5 : 0
			}));
	});
});

// LOGIN
app.get('/login',function(req,res){
	fs.readFile('./login.html','utf-8',function(err,html){
		res.writeHeader(200,{'Content-Type':'text/html'});
		res.end(html);
	});
});

app.post('/login',function(req,res){

		console.log(req.body);
		res.redirect('/');		
});
//app.use('/about',require('../capestone2/about.js').router);

// about
app.get('/about',function(req,res){
	fs.readFile('./about.html','utf-8',function(err,html){
		res.writeHeader(200,{'Content-Type':'text/html'});
		res.end(html);
	});
});

//Search
app.get('/path',function(req,res){
	var path_id = req.query.id;

	fs.readFile('./path/path.html','utf-8',function(err,html){
		res.writeHeader(200,{'Content-Type':'text/html'});
		res.end(ejs.render(html));
	});
	console.log("get query %d ",path_id);
});

app.post('/path',function(req,res){
		console.log(req.body);
		res.redirect('/path?id=20');
});
