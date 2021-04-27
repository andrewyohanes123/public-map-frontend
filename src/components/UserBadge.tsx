import { FC, ReactElement, useContext } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'

export const UserBadge: FC = (): ReactElement => {
  const { user, login } = useContext(UserContext);
  return (
    typeof user !== 'undefined' && login ?
    <Link className="p-p-3" style={{ background: 'var(--surface-600)', position: 'fixed', right: 15, top: 15, borderRadius: 8, color: 'var(--text-color)', textDecoration: 'none' }} to="/">
      <p>
        {user?.name}
      </p>
    </Link>
    :
    <></>
  )
}
