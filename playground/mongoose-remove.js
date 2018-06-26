const{ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

/*
Todo.remove({}).then((result) => {
  console.log(result);
});
*/

Todo.findByIdAndRemove("5b32a872a26aa60eeb155b25").then((todo) => {
  console.log(todo);
});
