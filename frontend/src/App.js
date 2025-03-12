import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateDatabasePage from './pages/CreateDatabasePage';
import CreateTablePage from './pages/CreateTablePage';
import InsertRecordPage from './pages/InsertRecordPage';
import ListRecordsPage from './pages/ListRecordsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/create-database">Criar Banco de Dados</Link></li>
            <li><Link to="/create-table">Criar Tabela</Link></li>
            <li><Link to="/insert-record">Inserir Registro</Link></li>
            <li><Link to="/list-records">Listar Registros</Link></li>
          </ul>
        </nav>

        <div className="App-header">
          <h1>Ferramenta Administrativa de Banco de Dados</h1>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-database" element={<CreateDatabasePage />} />
            <Route path="/create-table" element={<CreateTablePage />} />
            <Route path="/insert-record" element={<InsertRecordPage />} />
            <Route path="/list-records" element={<ListRecordsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
