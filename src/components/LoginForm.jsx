import React, { useState } from 'react'
import './LoginForm.css'

function LoginForm() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isFocused, setIsFocused] = useState({ password: false })
  const [formError, setFormError] = useState('')

  // Demo-only password gate. You can override via Vite env: VITE_DEMO_PASSWORD
  const CORRECT_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? 'Password@123'

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!password.trim()) {
      setFormError('Please enter password')
      return
    }

    if (password !== CORRECT_PASSWORD) {
      setFormError('Incorrect password')
      return
    }

    setFormError('')
    console.log('Login:', { emailOrPhone, password: '***' })
    alert('Login successful')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              id="emailOrPhone"
              name="username"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="Email/Phone"
              aria-label="Email or phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
            <div className="input-line"></div>
          </div>

          <div className="input-group">
            <label 
              className={isFocused.password || password ? 'active' : ''}
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              required
            />
            <div className="input-line"></div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          {formError ? (
            <div className="form-error" role="alert">
              {formError}
            </div>
          ) : null}

          <button type="submit" className="login-button">
            <span>Login</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a className="cta-link" href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
