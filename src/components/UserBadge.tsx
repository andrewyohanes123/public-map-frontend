import { FC, ReactElement, useContext } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'

export const UserBadge: FC = (): ReactElement => {
  const { user, login } = useContext(UserContext);
  return (
    typeof user !== 'undefined' && login ?
      <Link className="p-p-3" style={{ background: 'var(--surface-600)', position: 'fixed', right: 15, top: 15, borderRadius: 8, color: 'var(--text-color)', textDecoration: 'none' }} to="/dashboard">
        <p><i className="pi pi-fw pi-user"></i>&nbsp;{user?.name}</p>
      </Link>
      :
      <div className="p-d-flex" style={{ background: 'var(--surface-600)', position: 'fixed', right: 15, top: 15, borderRadius: 8, padding: 12 }}>
        <Link className="p-mr-3" style={{ color: 'var(--text-color)', textDecoration: 'none' }} to="/register">
          <p><i className="pi pi-fw pi-pencil"></i>&nbsp;Register</p>
        </Link>
        <Link style={{ color: 'var(--text-color)', textDecoration: 'none' }} to="/login">
          <p><i className="pi pi-fw pi-sign-in"></i>&nbsp;Login</p>
        </Link>
      </div>
  )
}
