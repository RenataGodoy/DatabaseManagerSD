import React, { useState, useEffect } from 'react';
import api from '../api';

function InsertRecordPage() {
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]); // Estado para armazenar as tabelas
  const [dbName, setDbName] = useState('');
  const [tableName, setTableName] = useState('');
  const [columnsData, setColumnsData] = useState([]);
  const [values, setValues] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await api.get('/show-databases');
        setDatabases(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDatabases();
  }, []);

  const handleDbSelect = async (e) => {
    setDbName(e.target.value);
    setTableName('');
    setColumnsData([]);
    setValues({});
    try {
      // Buscar tabelas do banco selecionado
      const response = await api.get(`/show-tables?dbName=${e.target.value}`);
      setTables(response.data);  // Armazena as tabelas para exibir
    } catch (err) {
      console.error('Erro ao carregar tabelas:', err);
    }
  };

  const handleTableSelect = async (e) => {
    const selectedTable = e.target.value;
    setTableName(selectedTable);
    try {
      const response = await api.get(`/show-columns?dbName=${dbName}&tableName=${selectedTable}`);
      setColumnsData(response.data);
      const initialValues = response.data.reduce((acc, column) => {
        acc[column.Field] = ''; // Inicializa todos os valores com uma string vazia
        return acc;
      }, {});
      setValues(initialValues); // Preenche os valores com base nas colunas
    } catch (err) {
      console.error('Erro ao carregar colunas:', err);
    }
  };

  const handleInputChange = (columnName, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [columnName]: value,
    }));
  };

  const handleInsertRecord = async () => {
    // Formatando os valores como um array de valores para a requisição POST
    const formattedValues = Object.values(values).map((value) =>
      typeof value === 'string' && value !== 'NULL' ? `'${value}'` : value
    );

    try {
      await api.post('/insert-record', { dbName, tableName, values: formattedValues });
      setMessage({ type: 'success', text: 'Registro inserido com sucesso!' });
    } catch (err) {
      setMessage({ type: 'error', text: `Erro ao inserir registro: ${err.response?.data?.error || err.message}` });
    }
  };

  return (
    <div>
      <h2>Inserir Registro</h2>
      <select onChange={handleDbSelect} value={dbName}>
        <option value="">Selecione o Banco de Dados</option>
        {databases.map((db, index) => (
          <option key={index} value={db.Database}>
            {db.Database}
          </option>
        ))}
      </select>

      <select onChange={handleTableSelect} value={tableName}>
        <option value="">Selecione a Tabela</option>
        {tables.map((table, index) => (
          <option key={index} value={table[`Tables_in_${dbName}`]}>
            {table[`Tables_in_${dbName}`]}
          </option>
        ))}
      </select>

      <h3>Valores</h3>
      {columnsData.map((col, index) => (
        <div key={index}>
          <label>{col.Field} ({col.Type})</label>
          <input
            type="text"
            value={values[col.Field]}
            onChange={(e) => handleInputChange(col.Field, e.target.value)}
            placeholder={`Valor para ${col.Field}`}
          />
        </div>
      ))}

      <button onClick={handleInsertRecord}>Inserir Registro</button>

      {message && (
        <div style={{ color: message.type === 'success' ? 'green' : 'red' }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default InsertRecordPage;
