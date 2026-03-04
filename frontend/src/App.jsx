import { useState, useEffect } from 'react'

const API = '/api/todos'

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = async () => {
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      setTodos(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [])

  const addTodo = async () => {
    if (!input.trim()) return
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input }),
    })
    setInput('')
    fetchTodos()
  }

  const toggleTodo = async (id, completed) => {
    await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    })
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🐳 Todo App – Docker</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Nouvelle tâche..."
        />
        <button style={styles.btn} onClick={addTodo}>Ajouter</button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}

      <ul style={styles.list}>
        {todos.map(todo => (
          <li key={todo.id} style={styles.item}>
            <span
              onClick={() => toggleTodo(todo.id, todo.completed)}
              style={{
                ...styles.text,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#888' : '#111',
                cursor: 'pointer',
              }}
            >
              {todo.completed ? '✅' : '⬜'} {todo.title}
            </span>
            <button style={styles.del} onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  container: { maxWidth: 600, margin: '60px auto', fontFamily: 'sans-serif', padding: '0 16px' },
  title: { textAlign: 'center', color: '#1d4ed8', marginBottom: 32 },
  inputRow: { display: 'flex', gap: 8, marginBottom: 24 },
  input: { flex: 1, padding: '10px 14px', fontSize: 16, borderRadius: 8, border: '1.5px solid #cbd5e1' },
  btn: { padding: '10px 20px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 },
  list: { listStyle: 'none', padding: 0 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', marginBottom: 8, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' },
  text: { fontSize: 15, flex: 1 },
  del: { background: 'none', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer', marginLeft: 8 },
}
