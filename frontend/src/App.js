import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateDatabasePage from './pages/CreateDatabasePage';
import CreateTablePage from './pages/CreateTablePage';
import InsertRecordPage from './pages/InsertRecordPage';
import ListRecordsPage from './pages/ListRecordsPage';

function App() {
  return (
    <Router>
      <div>
        <h1>Ferramenta Administrativa de Banco de Dados</h1>
        <nav>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/create-database">Criar Banco de Dados</Link></li>
            <li><Link to="/create-table">Criar Tabela</Link></li>
            <li><Link to="/insert-record">Inserir Registro</Link></li>
            <li><Link to="/list-records">Listar Registros</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-database" element={<CreateDatabasePage />} />
          <Route path="/create-table" element={<CreateTablePage />} />
          <Route path="/insert-record" element={<InsertRecordPage />} />
          <Route path="/list-records" element={<ListRecordsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

