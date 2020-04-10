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
  const { title, url, techs } = request.body;
  const likes = repositories.find(item => item.id === id ? item.likes : 0);

  if(repositories.filter(item => item.id === id).length === 0) {
    return response.status(400).json({ "error": "ID não encontrado"});
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
  const { id } = request.params;
  
  if(repositories.filter(item => item.id === id).length === 0) {
    return response.status(400).json({ "error": "ID não encontrado"});
  }
  if(repositories.length !== 0 ){
    repositories.map((item, index) => {
      if(item.id === id) {
        console.log(item.id , index);
        repositories.splice(index,1);
        return response.status(204).send('Content deleted');
      }
    });
  } else {
    return response.status(400).json({ "error": "ID não encontrado"});
  }

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const { method } = request;
  let repositoryLiked;
  if(method !== 'POST') return response.status(300).json({ "error": "ROTA ERRA"});
  if(repositories.filter(item => item.id === id).length === 0) {
    return response.status(400).json({ "error": "ID não encontrado"});
  } else {
    repositories.map(item => {
    if(item.id === id) {
      item.likes += 1;
    }
    repositoryLiked = item;
  });
  return response.json(repositoryLiked);
  }

  
});

module.exports = app;
