const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors());  // Habilita o CORS para permitir requisições de outros domínios

// Criação da conexão com o MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Use suas credenciais
  password: 'root',  // Use sua senha do MySQL
});

db.connect((err) => {
  if (err) {
    console.error('Erro de conexão com o banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Servidor está funcionando corretamente!');
  });
  
// Rota para criar um banco de dados
app.post('/create-database', (req, res) => {
  const { dbName } = req.body;
  const query = `CREATE DATABASE IF NOT EXISTS ${dbName}`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criar banco de dados', error: err });
    }
    res.status(200).json({ message: `Banco de dados ${dbName} criado com sucesso!` });
  });
});

//Rota para pegar os databases para aparecer no drop down
app.get('/show-databases', (req, res) => {
    const query = 'SHOW DATABASES';
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar bancos de dados', error: err });
      }
      res.status(200).json(results);
    });
  });


  // Rota para listar tabelas de um banco de dados
app.get('/show-tables', (req, res) => {
    const { dbName } = req.query;
    const query = `SHOW TABLES FROM ${dbName}`;
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar tabelas', error: err });
      }
      res.status(200).json(results);
    });
  });
  
// Rota para obter as colunas de uma tabela
app.get('/show-columns', (req, res) => {
    const { dbName, tableName } = req.query;
    db.query(`DESCRIBE ${dbName}.${tableName}`, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });
  
// Rota para criar uma tabela em um banco de dados
app.post('/create-table', (req, res) => {
  const { dbName, tableName, columns } = req.body;
  const query = `CREATE TABLE IF NOT EXISTS ${dbName}.${tableName} (${columns})`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criar tabela', error: err });
    }
    res.status(200).json({ message: `Tabela ${tableName} criada no banco de dados ${dbName} com sucesso!` });
  });
});

// Rota para inserir registros
app.post('/insert-record', (req, res) => {
  const { dbName, tableName, values } = req.body;
  const query = `INSERT INTO ${dbName}.${tableName} VALUES (${values})`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao inserir registro', error: err });
    }
    res.status(200).json({ message: 'Registro inserido com sucesso!' });
  });
});

// Rota para listar registros
app.get('/list-records', (req, res) => {
  const { dbName, tableName } = req.query;
  const query = `SELECT * FROM ${dbName}.${tableName}`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao listar registros', error: err });
    }
    res.status(200).json(results);
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
