const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require("body-parser")
const { json } = require('express/lib/response')
app.use(
  bodyParser.urlencoded({
      extended: true
  })
);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
let startingId = 126;
let users = [{username: 'SiobanfJ',_id: 125},{username: 'JohnFJ',_id:126}];
app.post('/api/users', (req,res) =>{
  let username = req.body.username;
  let id = startingId + 1;
  startingId = id;
  console.log(username);
  console.log(id);
  users.push({'username': username, '_id': id});
  res.json({'username': username, '_id': id});
  console.log(users);
})

app.get('/api/users', (req,res) =>{
  res.json(users);
})

app.post('/api/users/:_id/exercises',(req,res) => {
  let id = req.params._id;
  let description = req.body.description;
  let duration = Number(req.body.duration);
  let date = new Date(req.body.date).toDateString();
  if(date == "Invalid Date"){
    date = new Date().toDateString();
  }  
  let username = "unknown";
  let indexArray;
  users.forEach((user, index) => {
    if(user._id == id){
      console.log("id found")
      console.log(index);
      indexArray = index;
      username = user.username;
      users[index] = {'username': username, '_id': id, logs:{description: description, duration: duration, date: date}};   
    }
  });
  
  res.json(users[indexArray]);
  console.log(users)
})

app.get('/api/users/:_id/logs',(req,res) => {
  let id = req.params._id;
  users.forEach(user => {
    if(user._id == id){
      console.log("id found")
      console.log(user.logs)
      res.json({
        username: user.username,
        count: user.logs.length(),
        _id: user._id,
        log: [user.logs]
      });
      
    }
  });

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
