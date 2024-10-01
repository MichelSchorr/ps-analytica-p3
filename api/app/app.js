const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const PORT = 8000




//Rotas
app.get('/', (req, res) =>{
    res.send('Hello World!');
})

app.post('/age', (req, res) => {

    //recupera o body
    const data = req.body;

    //checando completude do body
    if(!data.name || !data.date || !data.birthdate){
        return res.status(400).json({message: 'Atributos faltando ou inválidos. Requests devem ser no formato: {"name": "Nome Sobrenome","birthdate": "yyyy-mm-dd ","date":  "YYYY-MM-DD "}'});
    }


    //converte as data para o formato Date
    data.date = new Date(data.date);
    data.birthdate = new Date(data.birthdate);



     //data atual
     const today = new Date();


    //checando validade do date
    if(data.date<today){
        return res.status(400).json({message: 'Atributo date inválido. date deve ser uma data no futuro'});
    }

 



    //ageNow
    var ageNow;
    if((today.getMonth()>data.birthdate.getMonth())||((today.getMonth()==data.birthdate.getMonth())&&(today.getDate()>=data.birthdate.getDate()))){
        ageNow = today.getFullYear() - data.birthdate.getFullYear();
    }else{
        ageNow = today.getFullYear() - data.birthdate.getFullYear() - 1;
    }

    //ageThen
    var ageThen;
    if((data.date.getMonth()>data.birthdate.getMonth())||((data.date.getMonth()==data.birthdate.getMonth())&&(data.date.getDate()>=data.birthdate.getDate()))){
        ageThen = data.date.getFullYear() - data.birthdate.getFullYear();
    }else{
        ageThen = data.date.getFullYear() - data.birthdate.getFullYear() - 1;
    }



    //resposta
    const response = 
    {
        quote: `Olá, ${data.name}! Você tem ${ageNow} anos e em ${(data.date.getDate()+1).toString().padStart(2, '0')}/${(data.date.getMonth()+1).toString().padStart(2, '0')}/${data.date.getFullYear()} você tería ${ageThen} anos.`,
        ageNow: ageNow,
        ageThen: ageThen
    }
    res.status(200).json(response);
})





app.post('/municipio-bairros', async(req, res) => {
    
    //recebe os parametros
    var municipio_nome_parametro = req.query.municipio;
    
    //separa nomes compostos
    var municipio_nome_palavras = municipio_nome_parametro.split("-");



    //coloca o nome do municipio na sintaxe do ibge
    var municipio_nome = "";
    municipio_nome_palavras.forEach(palavra => {

        //adiciona espacos entre palavras
        if(municipio_nome !== ""){
            municipio_nome = municipio_nome.concat(" ")
        }

        
        palavra = palavra.toLowerCase();
        const primeira_letra = palavra.slice(0, 1);
        const resto = palavra.slice(1);
        


        //adiciona mais uma palavra do nome do municipio no nome completo, ja com a sintaxe do ibge
        if(palavra === "da" || palavra === "de" || palavra === "do"){
            municipio_nome = municipio_nome.concat(primeira_letra, resto)
        }else{
            municipio_nome = municipio_nome.concat(primeira_letra.toUpperCase(), resto)
        }
    });


    
    
    //requisita a lista de todos os municipios do ibge
    const ibge_resposta =
    await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
    .catch(error => {
        console.error(error);
    });
    const lista_municipios = ibge_resposta.data;
    



    
    //encontra o nosso municipio desejado usando seu nome
    const municipio = lista_municipios.find(municipio => municipio.nome == municipio_nome);

    
    if(!municipio){
        return res.status(404).json({"message": "ERRO. Municipio não encontrado"});
    }



    //requisita a lista de bairros(subdistritos) do municipio
    const ibge_resposta_bairros =
    await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${municipio.id}/subdistritos`)
    .catch(error => {
        console.error(error);
    });
    const bairros = ibge_resposta_bairros.data;


    //separa os nomes dos bairros das outras informacoes
    var bairros_nomes = [];
    bairros.forEach(bairro => {
        bairros_nomes.push(bairro.nome)
    })



    return res.status(200).json({
        "municipio": municipio.nome,
        "bairros": bairros_nomes
    });
  });






//Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
