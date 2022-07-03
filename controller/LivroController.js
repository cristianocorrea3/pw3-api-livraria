const express = require('express');

const app = express();
const router = express.Router();

const upload = require('../helpers/upload/uploadImagem');
const deleteImage = require('../helpers/upload/deleteImagem');
const livro = require('../model/Livro');

router.post('/livro/cadastrarLivro', upload.array('files', 2) ,(req, res)=>{

    const { titulo, preco, detalhes, tblCategoriaumId } = req.body;
    const imagen_peq = req.files[0].path;
    const imagen_grd = req.files[1].path;

    livro.create(
        {
            titulo,
            preco,
            imagen_peq,
            imagen_grd,
            detalhes,
            tblCategoriaumId

        }
    ).then(
        ()=>{
            return res.status(201).json({
                erroStatus:false,
                mensagemStatus:'Livro inserido com sucesso.'
            });      
        }
    ).catch((erro)=>{
        return res.status(400).json({
            erroStatus: true,
            erroMensagem: erro
        });
    });

});

router.get('/livro/listarLivro', (req, res)=>{

    livro.findAll()
        .then((livros)=>{
            return res.status(200).json(livros)
        }).catch((erro)=>{
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: erro
            });
        });
});

router.get('/livro/listarLivroCodigo/:id', (req, res)=>{

    const { id } = req.params

    livro.findByPk(id)
        .then((livro)=>{
            return res.status(200).json(livro)
        }).catch((erro)=>{
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: erro
            });
        });
});

router.delete('/livro/excluirLivro/:id', (req, res)=>{

    const { id } = req.params;

    livro.findByPk(id)

        .then((livro)=>{

            let imagem_grd = livro.imagen_grd;
            let imagem_peq = livro.imagen_peq;

            livro.destroy({
                where:{id}
            }).then(
                ()=>{
                    deleteImage(imagem_peq);
                    deleteImage(imagem_grd);

                    return res.status(200).json({
                        erroStatus:false,
                        mensagemStatus:'Livro excluído com sucesso.'
                    });

                }).catch((erro)=>{
                    return res.status(400).json({
                        erroStatus: true,
                        erroMensagem: erro
                    });
                });

        });

});

router.put('/livro/editarLivro', upload.array('files', 2), (req, res)=>{

    const { titulo, preco, detalhes, tblCategoriaumId, id } = req.body;

        /** UPDATE COM IMAGEM **/
        if(req.files != ''){
            livro.findByPk(id)
            .then((livro)=>{

                let imagem_grd_old = livro.imagen_grd;
                let imagem_peq_old = livro.imagen_peq;

                deleteImage(imagem_peq_old);
                deleteImage(imagem_grd_old);

                let imagen_peq = req.files[0].path;
                let imagen_grd = req.files[1].path;

                /** ATUALIZAÇÃO DOS DADOS DE LIVRO **/
                livro.update(
                    {titulo,
                    imagen_peq,
                    imagen_grd,
                    preco,
                    detalhes,
                    tblCategoriaumId},
                    {where: {id}}
                ).then(
                    ()=>{
                        return res.status(200).json({
                            erroStatus:false,
                            mensagemStatus:'Livro alterado com sucesso.'
                        });
                    }).catch((erro)=>{
                        return res.status(400).json({
                            erroStatus: true,
                            erroMensagem: erro
                        });
                    });
            });

        }else{

            /** UPDATE SEM IMAGEM **/
            livro.update(
                {titulo,
                preco,
                detalhes,
                tblCategoriaumId},
                {where: {id}}
            ).then(
                ()=>{
                    return res.status(200).json({
                        erroStatus:false,
                        mensagemStatus:'Livro alterado com sucesso.'
                    });
                }).catch((erro)=>{
                    return res.status(400).json({
                        erroStatus: true,
                        erroMensagem: erro
                    });
                });
        }

});

module.exports = router;