var express = require('express')
var app = express()

var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var ejs = require('ejs')
app.set('view engine','ejs')

app.use(express.static('./public'))
var server = app.listen(80)

var io = require('socket.io')(server)

var mongoose = require('mongoose')

mongoose.connect('mongodb://test:lyj123@ds129762.mlab.com:29762/todotest',{useNewUrlParser: true})
var Schema = mongoose.Schema
var mySchema = new Schema({
  name:  String,
  phone: Number,    
  comment:   String
})
var myModel = mongoose.model('todoModel', mySchema)

app.get('/',function(req,res){
  res.sendFile( __dirname + '/index.html')
})
app.get('/form',function(req,res){
  res.sendFile( __dirname + '/form.html')
})

app.get('/restore',function(req,res){
  myModel.find({},function(erro,docs){
    res.render( __dirname + '/render/restore.ejs',{docs: docs})
  })
})
app.get('/communicate',function(req,res){
  res.sendFile( __dirname + '/communicate.html')
})
// 在线聊天
io.on('connection',function(socket){
  socket.on('typing',function(data){
    socket.broadcast.emit('typing',data)
  })
  socket.on('msg',function(data){
    socket.broadcast.emit('msg',data)
  })
})
// mongoose数据库操作
// app.post('/restore/:name',function(req,res){
//   myModel.create({name:req.params.name})
// })
app.delete('/restore/:name',function(req,res){
  myModel.deleteMany({name:req.params.name}, function(err){
    if(err) console.log(err);
  })
})

app.post('/welcome', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  myModel.create({name:req.body.name,phone:req.body.num})
  res.render( __dirname + '/render/welcome', {data: req.body.name})
})