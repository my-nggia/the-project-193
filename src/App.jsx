import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import GetData from './pages/GetData'
import HowToUse from './pages/HowToUse'
import RelatedInfo from './pages/RelatedInfo'

export default function App() {
  return (
    <PasswordGate>
    <div>
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        position: 'sticky',
        top: 15,
        zIndex: 100
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-0.5px' }}>
            the project <span style={{ color: 'var(--wine)' }}>193</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
            my.ngngia@gmail.com
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { to: '/',            label: 'Get Data' },
            { to: '/how-to-use',  label: 'How to use' },
            { to: '/info',        label: 'Related Information' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              style={({ isActive }) => ({
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--wine)' : 'var(--text-muted)',
                borderBottom: isActive ? '2px solid var(--wine)' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                fontFamily: 'var(--font)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <Routes>
        <Route path="/"           element={<GetData />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/info"       element={<RelatedInfo />} />
      </Routes>
    </div>
    </PasswordGate>
  )
}
