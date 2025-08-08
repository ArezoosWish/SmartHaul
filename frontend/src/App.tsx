import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 style={{ color: 'var(--color-primary)' }}>SmartHaul</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Design system tokens are active (colors, spacing, typography).</p>
    </>
  )
}

export default App
