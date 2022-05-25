const express = require('express');

const categoria = require('../model/Categoria');

/** CONFIGURAÇÃO DAS ROTAS **/
const router = express.Router();

/** DEFINIÇÃO DAS ROTAS **/

/* ROTA DE INSERÇÃO DE CATEGORIA (VERBO HTTP: POST) */
/*
Métodos do verbo da rota:
1º - A rota em si
2º - A ação que a rota deve executar (arrow function)
*/
router.post(
    '/categoria/cadastrarCategoria',
    (req, res)=>{

        //let  nome_categoria  = req.body.nome_categoria;
        let { nome_categoria } = req.body;

        categoria.create(
            {nome_categoria}
            //{nome_categoria:nome_categoria}
        ).then(
            ()=>{
                res.send('DADOS DE CATEGORIA INSERIDOS COM SUCESSO!');
            }
        );
        //console.log(nome_categoria);
        //console.log(req.body);
        //res.send('ROTA DE INSERÇÃO DE CATEGORIA');
    }
);
/* ROTA DE LISTAGEM GERAL DE CATEGORIA (VERBO HTTP: GET)*/
router.get(
    '/categoria/listarCategoria',
    (req, res)=>{
        //{order:['id', 'DESC']}
        categoria.findAll()
                .then(
                    (categorias)=>{
                    res.send(categorias);
                    }
                );

        //res.send('ROTA DE LISTAGEM GERAL DE CATEGORIA');
    }
);

/* ROTA DE LISTAGEM POR ID DE CATEGORIA (VERBO HTTP: GET)*/
router.get( '/categoria/listarCategoria/:id', (req, res)=>{

    let {id} = req.params;
    // console.log("ID: " + id);

    categoria.findByPk(id)
            .then(
                (categoria)=>{
                res.send(categoria);
                }
            );

});

/* ROTA DE ALTERAÇÃO DE CATEGORIA (VERBO HTTP: PUT)*/
router.put(
    '/categoria/alterarCategoria',
    (req, res)=>{

        // console.log(req.body);
        let {id, nome_categoria} = req.body;

        categoria.update(
                {nome_categoria},
                {where: {id}}
        ).then(
            ()=>{
                res.send('DADOS DE CATEGORIA ALTERADOS COM SUCESSO!');
            }
        );

    }
);
/* ROTA DE EXCLUSÃO DE CATEGORIA (VERBO HTTP: DELETE)*/
router.delete(
    '/categoria/excluirCategoria/:id',
    (req, res)=>{

        let {id} = req.params;

        categoria.destroy(
            {where: {id}}
        ).then(

            ()=>{
                res.send('CATEGORIA EXCLUÍDA COM SUCESSO!');
            }

        );

    }
);

module.exports = router;