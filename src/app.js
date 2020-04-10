const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const {
    title, 
    url,
    techs,
  } = request.body;

  const repository = {
    id: uuid(),
    title, 
    url, 
    techs, 
    likes: 0
  };

  repositories.push(repository);
  return response.status(201).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs} = request.body;

  if(repositories.filter(item => item.id === id).length === 0) {
    return response.status(404).json({ "error": "ID não encontrado"});
  }

  repositories.map(item => {
    if(item.id === id) {
      title ? item.title = title : '';
      url ? item.url = url : '';
      techs ? item.techs = techs : '';
    }
  });
  return response.status(200).json({
    id,
    title,
    url,
    techs
  });

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  repositories.map((item, index) => {
    if(item.id === id) {
      repositories.splice(index,1);
      return response.status(204);
    }
  });
  return response.status(404).json({ "message": `It wasn´t found the repository for id ${id}`});

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  let repositoryLiked;
  repositories.map(item => {
    if(item.id === id) {
      item.likes += 1;
    }
  repositoryLiked = item;
  });
  return response.json(repositoryLiked);
});

module.exports = app;
