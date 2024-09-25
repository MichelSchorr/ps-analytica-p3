const express = require('express');
const app = express();

const PORT = 8000




//Rotas
app.get('/', (req, res) =>{
    res.send('Hello World!');
})

app.post('/age', (req, res) => {})

//Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
