const express = require('express');
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

    //checando validade do date
    if(data.date<data.birthdate){
        return res.status(400).json({message: 'Atributo date inválido. date deve ser uma data mais recente que birthdate'});
    }

 

    //data atual
    const today = new Date();


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



//Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
