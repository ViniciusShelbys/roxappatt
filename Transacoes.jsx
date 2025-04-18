
import React, { useState, useEffect } from 'react';

const Transacoes = ({ darkMode }) => {
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const dados = localStorage.getItem('transacoes');
    if (dados) setTransacoes(JSON.parse(dados));
  }, []);

  return (
    <div style={{ padding: 20, paddingBottom: 80, color: darkMode ? '#fff' : '#000' }}>
      <h2>Transações</h2>
      {transacoes.length === 0 ? (
        <p>Nenhuma transação.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {transacoes.map((t, i) => (
            <li key={i} style={{
              background: '#fff',
              padding: 12,
              margin: '8px 0',
              borderRadius: 10,
              boxShadow: '0 0 5px #ccc'
            }}>
              <strong>{t.descricao}</strong><br />
              <span>R$ {t.valor.toFixed(2)} — {t.categoria} — {new Date(t.data).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transacoes;
