//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected successfully to MongoDB Server');

  /*
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5b2d90d7f1676a1633755100")
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  */

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5b2d8d0bf1676a1633754fbe")
  }, {
    $set: {
      name: "Jack"
    },
    $inc: {
      age: 6
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  //db.close();
});
