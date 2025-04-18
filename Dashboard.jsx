
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = ({ darkMode }) => {
  const [transacoes, setTransacoes] = useState(() => {
    const dados = localStorage.getItem(' 'transacoes');
    return dados ? JSON.parse(dados) : [];
  });

  const [form, setForm] = useState({ descricao: '', valor: '', categoria: '', data: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());

  const receita = transacoes.filter(t => t.valor > 0 && new Date(t.data).getMonth() === mesSelecionado)
    .reduce((a, b) => a + b.valor, 0);
  const despesas = transacoes.filter(t => t.valor < 0 && new Date(t.data).getMonth() === mesSelecionado)
    .reduce((a, b) => a + b.valor, 0);
  const saldo = receita + despesas;

  const categorias = {};
  const metas = { Lazer: 500, Comida: 1000, Transporte: 600 };

  transacoes.forEach(t => {
    const mes = new Date(t.data).getMonth();
    if (t.valor < 0 && mes === mesSelecionado) {
      categorias[t.categoria] = (categorias[t.categoria] || 0) + Math.abs(t.valor);
    }
  });

  useEffect(() => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
    desenharGrafico();
  }, [transacoes, mesSelecionado]);

  const desenharGrafico = () => {
    const ctx = document.getElementById("graficoPizza");
    if (!ctx) return;
    if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          data: Object.values(categorias),
          backgroundColor: ['#F3722C', '#F8961E', '#43AA8B', '#577590', '#F94144']
        }]
      }
    });
  };

  const salvar = () => {
    const nova = { ...form, valor: parseFloat(form.valor) };
    if (!nova.data) nova.data = new Date().toISOString();

    if (editIndex !== null) {
      const copia = [...transacoes];
      copia[editIndex] = nova;
      setTransacoes(copia);
      setEditIndex(null);
    } else {
      setTransacoes([...transacoes, nova]);
    }
    setForm({ descricao: '', valor: '', categoria: '', data: '' });
  };

  const editar = (i) => {
    setForm(transacoes[i]);
    setEditIndex(i);
  };

  const excluir = (i) => {
    const nova = transacoes.filter((_, idx) => idx !== i);
    setTransacoes(nova);
  };

  const input = { width: '100%', padding: 10, margin: '6px 0', borderRadius: 8, border: '1px solid #ccc' };
  const botao = { width: '100%', padding: 12, background: '#6C4AB6', color: '#fff', border: 'none', borderRadius: 8 };

  return (
    <div style={{ padding: 20, paddingBottom: 100, color: darkMode ? '#fff' : '#000' }}>
      <h2>Dashboard</h2>

      <select value={mesSelecionado} onChange={e => setMesSelecionado(Number(e.target.value))} style={input}>
        {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((mes, idx) => (
          <option key={idx} value={idx}>{mes}</option>
        ))}
      </select>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '20px 0' }}>
        <Card titulo="💰 Receita" valor={receita} cor="#28C76F" />
        <Card titulo="💸 Despesas" valor={despesas} cor="#EA5455" />
        <Card titulo="📊 Saldo" valor={saldo} cor={saldo >= 0 ? '#00CFE8' : '#FF9F43'} />
      </div>

      <canvas id="graficoPizza" width="300" height="300" style={{ background: '#fff', borderRadius: 10, marginBottom: 20 }}></canvas>

      <div style={{ marginBottom: 20 }}>
        <h3>🎯 Metas por Categoria</h3>
        {Object.keys(metas).map(cat => {
          const gasto = categorias[cat] || 0;
          const meta = metas[cat];
          const perc = Math.min((gasto / meta) * 100, 100);
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <strong>{cat}:</strong> R$ {gasto} / R$ {meta}
              <div style={{
                height: 10,
                background: '#eee',
                borderRadius: 5,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: perc + '%',
                  height: '100%',
                  background: perc >= 100 ? 'red' : 'green'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h3>Nova Transação</h3>
        <input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" style={input} />
        <input value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} type="number" placeholder="Valor" style={input} />
        <input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} placeholder="Categoria" style={input} />
        <input value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} type="date" style={input} />
        <button onClick={salvar} style={botao}>{editIndex !== null ? "Salvar Edição" : "Adicionar"}</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {transacoes.map((t, i) => (
          <li key={i} style={{ background: '#fff', padding: 10, marginBottom: 10, borderRadius: 8, boxShadow: '0 0 4px #ccc' }}>
            <strong>{t.descricao}</strong><br />
            <span>R$ {t.valor.toFixed(2)} — {t.categoria} — {new Date(t.data).toLocaleDateString()}</span><br />
            <button onClick={() => editar(i)} style={{ marginRight: 10 }}>✏️</button>
            <button onClick={() => excluir(i)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Card = ({ titulo, valor, cor }) => (
  <div style={{ background: cor, color: '#fff', padding: 20, borderRadius: 12, textAlign: 'center' }}>
    <strong>{titulo}</strong>
    <div style={{ fontSize: 22 }}>R$ {valor.toFixed(2)}</div>
  </div>
);

export default Dashboard;
