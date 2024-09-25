const express = require('express');
const app = express();

app.use(express.json());

const PORT = 8000




//Rotas
app.get('/', (req, res) =>{
    res.send('Hello World!');
})

app.post('/age', (req, res) => {

    const data = req.body;

    console.log(data);
    const name = data.name;
    const birthdate = new Date(data.birthdate);
    const date = new Date(data.date);

    console.log(name, birthdate, date);

    const today = new Date();
    



    var age_today;
    //age_today
    if((today.getMonth()>birthdate.getMonth())||((today.getMonth()==birthdate.getMonth())&&(today.getDate()>=birthdate.getDate()))){
        age_today = today.getFullYear() - birthdate.getFullYear();
    }else{
        age_today = today.getFullYear() - birthdate.getFullYear() - 1;
    }

    var age_then;
    //age_then
    if((date.getMonth()>birthdate.getMonth())||((date.getMonth()==birthdate.getMonth())&&(date.getDate()>=birthdate.getDate()))){
        age_then = date.getFullYear() - birthdate.getFullYear();
    }else{
        age_then = date.getFullYear() - birthdate.getFullYear() - 1;
    }


    const response = 
    {
        quote: `Olá, ${name}! Você tem ${age_today} anos e em ${(date.getDate()+1).toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} você tería ${age_then} anos.`,
        ageNow: age_today,
        ageThen: age_then
    }
        

    res.status(200).json(response);


    res.status(200).json(data);

})



//Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
