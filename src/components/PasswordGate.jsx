import { useState } from 'react'

const PASSWORD = import.meta.env.VITE_APP_PASSWORD

export default function PasswordGate({ children }) {
  const [input, setInput]       = useState('')
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('unlocked') === 'true'
  )
  const [error, setError]       = useState(false)

  const handleSubmit = () => {
    if (input === PASSWORD) {
      sessionStorage.setItem('unlocked', 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (unlocked) return children

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--cream)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 'var(--radius)',
        border: '1px solid var(--border)', padding: '2.5rem 2rem',
        width: '100%', maxWidth: 400, textAlign: 'center',
      }}>
        <div style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.5px', marginBottom: 4 }}>
          the project <span style={{ color: 'var(--wine)' }}>193</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
          Enter password to continue
        </p>

        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%', padding: '12px 16px', fontSize: 14,
            border: `1px solid ${error ? 'var(--wine)' : 'var(--border)'}`,
            borderRadius: 10, outline: 'none', background: 'var(--cream)',
            color: 'var(--text)', fontFamily: 'var(--font)', marginBottom: 8,
          }}
        />

        {error && (
          <p style={{ fontSize: 12, color: 'var(--wine)', marginBottom: 8 }}>
            Incorrect password! Try again!
          </p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', background: 'var(--wine)', color: '#fff',
            border: 'none', borderRadius: 10, padding: '12px',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font)', marginTop: 4,
          }}
        >
          Enter
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 20 }}>
          Contact My Gia Nguyen for access
        </p>
      </div>
    </div>
  )
}
