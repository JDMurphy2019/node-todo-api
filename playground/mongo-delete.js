//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected successfully to MongoDB Server');

  /*
  db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  });
  */

  /*
  db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  });
  */

  /*
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  })
  */

  /*
  db.collection('Users').deleteMany({name: "Jack"}).then((result) => {
    console.log(result);
  });
  */

  db.collection('Users').findOneAndDelete({_id: new ObjectID("5b2d8ccef1676a1633754f9c")}).then((result) => {
    console.log(result);
  });


  //db.close();
});
