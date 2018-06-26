// importação do express(lib)
const express = require ('express');
// importação do banco MongoDB
const expressMongoDb = require ('express-mongo-db');
// importação de tudo que iremos escrever no body do código 
const bodyParser = require ('body-parser');
// importação do cors para a liberação do browser
const cors = require ('cors');
// importação de objectID para string
const ObjectID = require ('mongodb').ObjectID;

// variavel constante (não muda o valor) e o express é atribuido dentro dessa váriavel para ser executada no decorrer do código.
const app = express();

//cria conexão com o banco de dados
//e a disponibiliza na variável req.db
app.use(expressMongoDb('mongodb://lirachocola:lirachocolates123@165.227.221.155/lirachocolates'));

//converte os dados presentes no corpo da requisição em JSON
//e os disponibiliza na variável req.body
app.use(bodyParser.json());

//adiciona o header Access-Control-Allow-Origin:*
//que libera acesso para essa API por qualquer domínio
app.use(cors());

// busca todos os sabores de brigadeiros
app.get('/brigadeiros', (req, res) => {

    req.db.collection('lirachocolates').find().toArray((err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});






// busca um sabor de brigadeiro pelo id
app.get('/brigadeiros/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('lirachocolates').findOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        if(!data){
            res.status(404).send();
            return;
        }

        res.send(data);
    });
});

//insere um novo sabor de brigadeiro
app.post('/brigadeiros', (req, res) => {
    //remove dados indesejados do body
    let brigadeiro = {
        sabor: req.body.sabor,
        cor: req.body.cor,
        cobertura: req.body.cobertura,
        peso: req.body.peso
    };

    // exemplo de validação de email
    // if(req.body.email.indexOf('@') == -1){
    //     res.status(400).send({mensagem: 'Email inválido'});
    //     return;
    // }

    req.db.collection('lirachocolates').insert(brigadeiro, (err) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(req.body);
    });
});

// atualiza um sabor de brigadeiro pelo id
app.put('/brigadeiros/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    let brigadeiro = {
        sabor: req.body.sabor,
        recheio: req.body.recheio,
        cobertura: req.body.cobertura
    };

    req.db.collection('lirachocolates').updateOne(query, brigadeiro, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});

// deleta um sabor de brigadeiro pelo id
app.delete('/brigadeiros/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('lirachocolates').deleteOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }

        res.send(data);
    });
});

app.listen(process.env.PORT || 3000, ()=>console.log("Aplicação concluida !"));

