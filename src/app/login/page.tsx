'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'Senha incorreta')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        fontFamily: 'system-ui, sans-serif',
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#141414',
          border: '1px solid #262626',
          borderRadius: 16,
          padding: 32,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#aaff00',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              fontSize: 22,
              fontWeight: 900,
              color: '#080808',
            }}
          >
            ◉◉
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f0', margin: 0, letterSpacing: '0.05em' }}>
            COBRA ENHANCE
          </h1>
          <p style={{ fontSize: 13, color: '#aaff00', marginTop: 4 }}>AI Image Upscaler</p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              fontSize: 13,
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6 }}>Senha de acesso</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          placeholder="••••••••"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: 8,
            padding: '12px 14px',
            fontSize: 14,
            outline: 'none',
            background: '#1c1c1c',
            border: '1px solid #2a2a2a',
            color: '#f0f0f0',
            marginBottom: 16,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            borderRadius: 8,
            padding: '12px',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            cursor: loading ? 'default' : 'pointer',
            background: '#aaff00',
            color: '#080808',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#444', marginTop: 20 }}>
          © 2026 CBR Marketing LTDA
        </p>
      </form>
    </div>
  )
}
