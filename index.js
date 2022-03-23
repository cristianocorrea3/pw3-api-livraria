/* Importação do pacote express */
const express = require('express');

/*Instancia executavel do express */
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

/*Importação da conexão com o banco de dados*/
// const connection = require('./database/database');

/*Importação das models*/
const Livro = require('./model/Livro');
const Categoria = require('./model/Categoria');

/*Importação das rotas*/
const categoriaController = require('./controller/CategoriaController');
app.use('/', categoriaController);

const livroController = require('./controller/LivroController');
app.use('/', livroController);

/*Servidor de requisições da aplicação */
app.listen(3000, ()=>{
    console.log('Servidor Rodando na Porta 3000 - URL: http://Localhost3000');
}); 
