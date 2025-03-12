import React, { useState } from 'react';
import api from '../api';

function CreateDatabasePage() {
  const [dbName, setDbName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateDatabase = async () => {
    try {
      const response = await api.post('/create-database', { dbName });
      setMessage({ type: 'success', text: `Banco de dados ${dbName} criado com sucesso!` });
    } catch (err) {
      setMessage({ type: 'error', text: `Erro ao criar banco de dados: ${err.response.data.error}` });
    }
  };

  return (
    <div>
      <h2>Criar Banco de Dados</h2>
      <input
        type="text"
        placeholder="Nome do banco de dados"
        value={dbName}
        onChange={(e) => setDbName(e.target.value)}
      />
      <button onClick={handleCreateDatabase}>Criar Banco de Dados</button>
      {message && (
        <div style={{ color: message.type === 'success' ? 'green' : 'red' }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default CreateDatabasePage;
