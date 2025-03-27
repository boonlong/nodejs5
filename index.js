const express = require('express');
const mustache = require('mustache-express');
var mysql = require('mysql');
const app = express();
app.engine('html', mustache());
app.set('view engine', 'html');
app.use(express.static ('static'))
app.use(express.urlencoded({ extended: false }));
// DB connect
var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'12345678',
	database:'webdb'
});
connection.connect((error)=>{
	(error?console.log(error):console.log('Connected..!'));
});
// Routes
app.get('/', function(req, res){
    connection.query("select * from member",(e,r)=>{
        if(e){
            res.send('Error:'+e.message);
        }else{
            res.render('welcome',{r});
        }
    });
}); 
app.post('/add', function(req, res){
    let mem_name=req.body.mem_name;
    let mem_user=req.body.mem_user;
    let mem_pass=req.body.mem_pass;
    let amember=[mem_name,mem_user,mem_pass];
    connection.query("insert into member values (null,?,?,?)",amember,(e,r)=>{
        if(e){
            res.send('Error:'+e.message); 
        }else{
            res.redirect('/'); 
        }
    });
}); 
app.get('/del', function(req, res){
    //console.log(req.query.mem_id);
    let mem_id=req.query.mem_id;
    connection.query("delete from member where mem_id=?",
        [mem_id],(e,r)=>{
        (e?res.send('error:'+e.message):res.redirect('/'));
    });
});
app.get('/edit', function(req, res){
    let mem_id=req.query.mem_id;
    connection.query("select * from member where mem_id=?",
        [mem_id],(e,r)=>{
        (e?res.send('error:'+e.message):res.render('edit',{r}));
    });      
});
app.post('/save', function(req, res){
    let mem_id=req.query.mem_id;
    let mem_name=req.body.mem_name;
    let mem_user=req.body.mem_user;
    let mem_pass=req.body.mem_pass;
    let amember=[mem_name,mem_user,mem_pass,mem_id];
    let sql="update member set mem_name=?,mem_user=?,mem_pass=? where mem_id=?";
    connection.query(sql,amember,(e,r)=>{
        if(e){
            res.send('Error:'+e.message); 
        }else{
            res.redirect('/'); 
        }
    });
});

const port = 8001
app.listen(port, () => console.log(`Served at http://localhost:${port}`))
