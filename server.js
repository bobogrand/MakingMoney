var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');

/*추가*/
var http = require('http'),
	https = require('https')

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

var port1 = 80;
var port2 = 443;

var data;
/*추가*/

var connection = mysql.createConnection({
	user : 'root',
	password : 'qwe123',
	database : 'capestone2'
});
connection.connect();

app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.listen(80,function(){
	console.log('running at 80');
});

/*추가*/
/*
http.createServer(app).listen(port1,function(){
		console.log("Http server listening on port " + port1);
		 });
*/
https.createServer(options, app).listen(port2, function(){
		console.log("Https server listening on port " + port2);
		 });

/*추가*/

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
				reiviews5 : 0
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
app.get('/path',function(req,res,fields){
	var path_id = req.query.id;
	sql = 'Select * from path where id =' + path_id;
	console.log(sql);
	connection.query(sql, function(err,rows){	
		console.log(rows);
	});
	fs.readFile('./path/path.html','utf-8',function(err,html){
		res.writeHeader(200,{'Content-Type':'text/html'});
		res.end(ejs.render(html));
	});
	console.log("get query %d ",path_id);
});

app.post('/path',function(req,res){
		var path_id = 0;
		var city = req.body.city;
		var sql = 'select * from path where p_city like ' + '\'%'+ req.body.city+'%\'';
		connection.query(sql,function(err,rows,fields){
			var data=[];
			data.push(rows[0].start_Lng);
			data.push(rows[0].start_Lat);
			data.push(rows[0].end_Lng);
			data.push(rows[0].end_Lat);
			console.log("result is :"+data[0]);
			console.log(rows);
		});
		console.log(req.body);
		res.redirect('/path');
});

app.post('/',function(req,res){
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var city = req.body.city;
	var sql = 'select * from festival where ';


	if (city != ''){
		sql += 'f_city like' + '\'%'+ city + '%\' ';

	}
	if (start_date != ''){
		if(city != '')
			sql += ' or ';
		sql += ' start_date >= ' + start_date;
		if(end_date != ''){
			sql += ' and ';
			sql += 'end_date <= ' + end_date;
		}
	}


	connection.query(sql,function(err,rows){
			console.log(rows);
	});
	
	console.log(req.body);

});

app.get('/list',function(req,res){
	fs.readFile('./path/list.html','utf-8',function(err,html){
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
			reviews5 : 0
		}));

	});
});
