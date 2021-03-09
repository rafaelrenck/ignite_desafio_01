const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  if (!username) {
    return response.status(400).json({ error: "User not provided"});
  }

  const userAlreadyExists = users.find((user) => user.username === username);

  if (!userAlreadyExists) {
    return response.status(404).json({ error: "User not found"});
  }

  request.user = userAlreadyExists;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  response.status(201).json({ message: "User created successfully"});
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { title, deadline } = request.body;

  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  });

  response.status(201).json({ message: "Todo created successfully"});
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;

  const { user } = request;

  const { title, deadline } = request.body;

  const todoToUpdate = user.todos.find((todo) => todo.id === id);

  if (!todoToUpdate) {
    return response.status(404).json({ error: "Todo not found"});
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;