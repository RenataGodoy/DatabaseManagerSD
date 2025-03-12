import React, { useState, useEffect } from 'react';
import api from '../api';

function ListRecordsPage() {
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [dbName, setDbName] = useState('');
  const [tableName, setTableName] = useState('');
  const [records, setRecords] = useState([]);

  // Carregar os bancos de dados ao montar o componente
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await api.get('/show-databases');
        setDatabases(response.data);
      } catch (err) {
        console.error('Erro ao carregar bancos de dados:', err);
      }
    };

    fetchDatabases();
  }, []);

  // Carregar as tabelas do banco de dados selecionado
  const handleDbSelect = async (e) => {
    const selectedDbName = e.target.value;
    setDbName(selectedDbName);
    setTableName('');
    setRecords([]); // Limpa os registros
    try {
      // Buscar as tabelas do banco de dados selecionado
      const response = await api.get(`/show-tables?dbName=${selectedDbName}`);
      console.log('Tabelas recebidas:', response.data);  // Verifique as tabelas no console

      // Mapeando para obter o nome da tabela
      const tablesData = response.data.map((item) => item[`Tables_in_${selectedDbName}`]);
      console.log('Tabelas no estado:', tablesData); // Verificar o estado das tabelas
      setTables(tablesData); // Atualiza as tabelas
    } catch (err) {
      console.error('Erro ao carregar tabelas:', err);
      setTables([]); // Se falhar, define como array vazio
    }
  };

  // Buscar os registros da tabela selecionada
  const handleListRecords = async () => {
    try {
      const response = await api.get(`/list-records?dbName=${dbName}&tableName=${tableName}`);
      setRecords(Array.isArray(response.data) ? response.data : []); // Garante que records seja um array
    } catch (err) {
      console.error('Erro ao listar registros:', err);
      setRecords([]); // Se falhar, define como array vazio
    }
  };

  return (
    <div>
      <h1>Listar Registros</h1>

      {/* Dropdown para selecionar o Banco de Dados */}
      <select onChange={handleDbSelect} value={dbName}>
        <option value="">Selecione o Banco de Dados</option>
        {databases && databases.length > 0 ? (
          databases.map((db, index) => (
            <option key={index} value={db.Database}>
              {db.Database}
            </option>
          ))
        ) : (
          <option value="">Nenhum banco de dados disponível</option>
        )}
      </select>

      {/* Dropdown para selecionar a Tabela */}
      <select onChange={(e) => setTableName(e.target.value)} value={tableName} disabled={!dbName}>
        <option value="">Selecione a Tabela</option>
        {tables && tables.length > 0 ? (
          tables.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))
        ) : (
          <option value="">Nenhuma tabela disponível</option>
        )}
      </select>

      {/* Botão para listar os registros */}
      <button onClick={handleListRecords} disabled={!dbName || !tableName}>
        Listar Registros
      </button>

      {/* Exibição dos registros */}
      {records.length > 0 ? (
        <ul>
          {records.map((record, index) => (
            <li key={index}>{JSON.stringify(record)}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum registro encontrado.</p>
      )}
    </div>
  );
}

export default ListRecordsPage;
