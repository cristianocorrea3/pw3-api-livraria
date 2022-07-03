const fs = require('fs');

const deleteImage = (imagem)=>{

    fs.unlink(imagem, (erro)=>{

        if(erro){
            console.log('ERRO AO EXLCUIR A IMAGEM: ' + erro);
        }else{
            console.log('IMAGEM PEQUENA EXCLUIDA COM SUCESSO! ');
        } 

    });

}

module.exports = deleteImage;