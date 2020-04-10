const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkID(request, response, next) {
  const { id } = request.params;
  if(repositories.filter(item => item.id === id).length === 0) {
    return response.status(400).json({ "error": "ID não encontrado"});
  }
  next();
}

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

app.put("/repositories/:id",checkID, (request, response) => {
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(repo => repo.id === id);

  let repository;
  repositories.map(item => {
    if(item.id === id) {
      repository = {
        id,
        title: title || item.title,
        url: url || item.url,
        techs: techs || item.techs,
        likes: repositories[findRepositoryIndex].likes
      }
      item = repository;
    }
  });
  return response.status(200).json(repository);

});

app.delete("/repositories/:id", checkID, (request, response) => {
  const { id } = request.params;
    repositories.map((item, index) => {
      if(item.id === id) {
        console.log(item.id , index);
        repositories.splice(index,1);
        return response.status(204).send('Content deleted');
      }
    });
});

app.post("/repositories/:id/like",checkID, (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repo => repo.id === id);

  repositories[findRepositoryIndex].likes += 1;

  return response.json(repositories[findRepositoryIndex]);

});

module.exports = app;
