
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new Todo', (done) => {
    var text = 'test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return a 400 status', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

  describe('GET /todos/:id', () => {
    it('should return a todo doc', (done) => {
      var todoID = todos[0]._id.toHexString();
      var text = todos[0].text;
      request(app)
        .get('/todos/' + todoID)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      var hexID = new ObjectID().toHexString();

      request(app)
        .get('/todos' + hexID)
        .expect(404)
        .end(done);
     });

     it('should return 404 if ObjectID is invalid', (done) => {
       request(app)
         .get('/todos/777')
         .expect(404)
         .end(done);
      });

    describe('DELETE /todos/:id', () => {
      it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();

        request(app)
        .delete('/todos/' + hexID)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexID);
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }
          Todo.findById(hexID).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));
        });
      });

      it('should return 404 if todo not found', (done) => {
        var hexID = new ObjectID().toHexString();

        request(app)
          .delete('/todos' + hexID)
          .expect(404)
          .end(done);
       });

       it('should return 404 if ObjectID is invalid', (done) => {
         request(app)
           .delete('/todos/777')
           .expect(404)
           .end(done);
        });
    });
  });

describe('PATCH /todos/:id', () => {

  it('Should update the todo', (done) => {
    var hexID = todos[0]._id.toHexString();
    var text = 'Test 1';
    request(app)
      .patch('/todos/' + hexID)
      .send({
        completed: true,
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    var hexID = todos[1]._id.toHexString();
    var text = 'Test 2';
    request(app)
      .patch('/todos/' + hexID)
      .send({
        completed: false,
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {

  it('shoud return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {

  it('should create a user', (done) =>  {
    var email = 'example@example.com';
    var password = '123example!'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = '*';
    var password = '|';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = 'jack.murphy@mchsi.com';
    var password = '123password!';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

});
