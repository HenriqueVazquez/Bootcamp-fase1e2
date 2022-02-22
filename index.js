const express = require('express');
const server = express();

server.use(express.json());


const users= ['Henrique', 'Karen', 'Sophia', 'Lucilene'];

//middlewares globais

server.use((request, response, next) =>{
  console.time('Request');

  console.log(`Método ${request.method}, URL ${request.url}`);

   next();
   console.timeEnd(`Request`);
});

//Middleware local 
function checkUserExists(request, response, next){
  if (!request.body.name) {
    return response.status(400).json({Error: `User name is required`});
  }

  return next();
}

// middleware de verificação de parametros 

function checkUserinArray(request, response, next) {
  const user = users[request.params.index]
  if(!user) {
    return response.status(400).json({Error: `User does not exists`});
  }

  // deixando todas as rotas que utilizam esse array com acesso a uma variavel
  request.user = user;

  return next();
}

//Busca todos os usuários
server.get('/users', (request, response) => {
  return response.json(users);
});

//Busca usuário especifico
server.get('/users/:index', checkUserinArray, (request, response) => {
  //const {index} = request.params;
  return response.json(request.user); // utilizando valores enviados pelo middleware
});

//cadastra usuário
server.post('/users', checkUserExists ,(request, response) => {
  const {name} = request.body;

  users.push(name);

  return response.json(users);
  
});


//alterar usuário
server.put('/users/:index', checkUserExists, checkUserinArray ,(request, response,) =>{
    const {index} = request.params;
    const {name} = request.body;
    users[index] = name;
    return response.json(users);
});

//deletar usuário
server.delete('/users/:index', checkUserinArray, (request, response,) =>{
  const {index} = request.params;

  users.splice(index, 1);
  return response.send();

});

server.listen(3000);

