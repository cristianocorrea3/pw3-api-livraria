const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const router = express.Router();

const livro = require('../model/Livro');

/***** MULTER - STORAGE *****/
/** GERENCIA O ARMAZENAMENTO DOS ARQUIVOS **/
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads/');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now().toString() + '_'+ file.originalname);
    }
});

/***** MULTER - FILTER *****/
/** GERENCIA O TIPO DE ARQUIVO QUE PODE SER RECEBIDO **/
const fileFilter = (req, file, cb)=>{

    if( file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/png'){
        
        cb(null, true);

    }else{

        cb(null, false);

    }

}

/***** MULTER - UPLOAD *****/
/** EXECUTA O PROCESSO DE ARMAZENAMENTO **/
const upload = multer({
    storage: storage,
    limits:{ 
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/livro/cadastrarLivro', upload.array('files', 2) ,(req, res)=>{

    // console.log(req.files[0]);
    // console.log(req.files[1]);
    // console.log(req.body);
    //res.send().status(200);

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
            res.send('DADOS DE LIVRO INSERIDOS COM SUCESSO!');      
        }
    );

});

router.get('/livro/listarLivro', (req, res)=>{

    livro.findAll()
        .then((livros)=>{
            res.send(livros)
        });
});

router.get('/livro/listarLivroCodigo/:id', (req, res)=>{

    const { id } = req.params

    livro.findByPk(id)
        .then((livroId)=>{
            res.send(livroId)
        });
});

router.delete('/livro/excluirLivro/:id', (req, res)=>{

    const { id } = req.params;

    livro.findByPk(id)

        .then((livro)=>{

            let imagen_grd = livro.imagen_grd;
            let imagen_peq = livro.imagen_peq;

            livro.destroy({
                where:{id}
            }).then(
                ()=>{

                    /** EXCLUSÃO DA IMAGEM PEQUENA **/
                    fs.unlink(imagen_peq, (error)=>{

                        if(error){
                            console.log('ERRO AO EXLCUIR A IMAGEM: ' + error);
                        }else{
                            console.log('IMAGEM PEQUENA EXCLUIDA COM SUCESSO! ');
                        } 

                    });

                    /** EXCLUSÃO DA IMAGEM GRANDE **/
                    fs.unlink(imagen_grd, (error)=>{

                        if(error){
                            console.log('ERRO AO EXLCUIR A IMAGEM: ' + error);
                        }else{
                            console.log('IMAGEM GRANDE EXCLUIDA COM SUCESSO! ');
                        } 

                    });

                    res.send('DADOS DE LIVRO EXCLUIDOS COM SUCESSO!');

                }
            );

        });

});

router.put('/livro/editarLivro', upload.array('files', 2), (req, res)=>{

    const { titulo, preco, detalhes, tblCategoriaumId, id } = req.body;

    /** UPDATE COM IMAGEM **/
        if(req.files != ''){

            livro.findByPk(id)
            .then((livro)=>{

                let imagen_grd = livro.imagen_grd;
                let imagen_peq = livro.imagen_peq;

                /** EXCLUSÃO DA IMAGEM PEQUENA **/
                fs.unlink(imagen_peq, (error)=>{

                    if(error){
                        console.log('ERRO AO EXLCUIR A IMAGEM: ' + error);
                    }else{
                        console.log('IMAGEM PEQUENA EXCLUIDA COM SUCESSO! ');
                    } 
    
                });

                /** EXCLUSÃO DA IMAGEM GRANDE **/
                fs.unlink(imagen_grd, (error)=>{

                    if(error){
                        console.log('ERRO AO EXLCUIR A IMAGEM: ' + error);
                    }else{
                        console.log('IMAGEM GRANDE EXCLUIDA COM SUCESSO! ');
                    } 
    
                });

                imagen_peq = req.files[0].path;
                imagen_grd = req.files[1].path;

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
                        res.send('DADOS DE LIVRO ALTERADOS COM SUCESSO!');
                    }
                );
                
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
                    res.send('DADOS DE LIVRO ALTERADOS COM SUCESSO!');
                }
            );

        }

});

module.exports = router;