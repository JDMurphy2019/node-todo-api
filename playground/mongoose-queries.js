const{ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

//var id = '5b30459a705ebcd034e24b3011';

/*
if(!ObjectID.isValid(id)){
  console.log('ID not valid');
}
*/

/*
Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});
*/

/*
Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('ID not found');
  }
  console.log('Todo by ID', todo);
}).catch((e) => console.log(e));
*/

var id = '5b2ec2161743efdc0c232787';

User.findById(id).then((user) => {
  if(!user){
    return console.log('User ID not found');
  }
  console.log('User', user);
}).catch((e) => console.log(e));
