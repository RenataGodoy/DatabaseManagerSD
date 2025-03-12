import React, { useState, useEffect } from 'react';
import api from '../api';

function CreateTablePage() {
  const [databases, setDatabases] = useState([]);
  const [dbName, setDbName] = useState('');
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: 'INT', length: '', nullable: true, primaryKey: false }]);
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

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'INT', length: '', nullable: true, primaryKey: false }]);
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const handleCreateTable = async () => {
    const formattedColumns = columns
      .map(col => {
        let columnDefinition = `${col.name} ${col.type}${col.length ? `(${col.length})` : ''} ${col.nullable ? '' : 'NOT NULL'}`;
        if (col.primaryKey) {
          columnDefinition += ' PRIMARY KEY';
        }
        return columnDefinition;
      })
      .join(', ');

    try {
      await api.post('/create-table', { dbName, tableName, columns: formattedColumns });
      setMessage({ type: 'success', text: `Tabela ${tableName} criada com sucesso!` });
    } catch (err) {
      setMessage({ type: 'error', text: `Erro ao criar tabela: ${err.response?.data?.error || err.message}` });
    }
  };

  return (
    <div>
      <h2>Criar Tabela</h2>
      <select onChange={(e) => setDbName(e.target.value)} value={dbName}>
        <option value="">Selecione o Banco de Dados</option>
        {databases.map((db, index) => (
          <option key={index} value={db.Database}>{db.Database}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Nome da tabela"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />
      <h3>Colunas</h3>
      {columns.map((col, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Nome da coluna"
            value={col.name}
            onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
          />
          <select value={col.type} onChange={(e) => handleColumnChange(index, 'type', e.target.value)}>
            <option value="INT">INT</option>
            <option value="VARCHAR">VARCHAR</option>
            <option value="BOOLEAN">BOOLEAN</option>
            <option value="TEXT">TEXT</option>
            <option value="DATE">DATE</option>
          </select>
          {col.type === 'VARCHAR' && (
            <input
              type="number"
              placeholder="Tamanho"
              value={col.length}
              onChange={(e) => handleColumnChange(index, 'length', e.target.value)}
            />
          )}
          <label>
            <input
              type="checkbox"
              checked={col.nullable}
              onChange={(e) => handleColumnChange(index, 'nullable', e.target.checked)}
            />
            Permitir NULL
          </label>
          <label>
            <input
              type="checkbox"
              checked={col.primaryKey}
              onChange={(e) => handleColumnChange(index, 'primaryKey', e.target.checked)}
            />
            Chave Primária
          </label>
          <button type="button" onClick={() => removeColumn(index)} style={{ marginLeft: '10px', color: 'red', fontSize: '20px' }}>−</button>
        </div>
      ))}
      <button onClick={addColumn}>+ Adicionar Coluna</button>
      <button onClick={handleCreateTable}>Criar Tabela</button>
      {message && <div style={{ color: message.type === 'success' ? 'green' : 'red' }}>{message.text}</div>}
    </div>
  );
}

export default CreateTablePage;
