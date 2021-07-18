import { FC, ReactElement, useContext, useMemo, useCallback, lazy, Suspense, useRef, useState } from 'react'
import { useRouteMatch, useHistory, useLocation, Route, Redirect } from 'react-router-dom'
import { Card } from 'primereact/card'
import { TabMenu } from 'primereact/tabmenu'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { MenuItem } from 'primereact/api'
import { UserContext } from '../contexts/UserContext'

const Users = lazy(() => import('./Users').then(m => ({ default: m.Users })));
const TypesPage = lazy(() => import('./TypesPage').then(m => ({ default: m.TypesPage })));
const MapEditor = lazy(() => import('../components/MapEditor').then(m => ({ default: m.MapEditor })));

export const Dashboard: FC = (): ReactElement => {
  const { user, login, setLogout, auth } = useContext(UserContext);
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { push } = useHistory();
  const toast = useRef<Toast>(null);
  const [loading, toggleLoading] = useState<boolean>(false);

  const menuItems: MenuItem[] = useMemo<MenuItem[]>(() => (
    [
      {
        label: 'Pengguna',
        icon: 'pi pi-fw pi-user',
        target: `${path}/pengguna`
      },
      {
        label: 'Tipe Point',
        icon: 'pi pi-fw pi-map-marker',
        target: `${path}/tipe-point`
      },
    ]
  ), [path]);

  const navigate = useCallback(({ value }: { value: MenuItem }) => {
    // setActiveTab(value);
    push(`${value.target}`);
  }, [push]);

  const logout = useCallback(() => {
    toggleLoading(true);
    auth?.remove().then(resp => {
      toast.current?.show({ severity: `success`, summary: 'Logout berhasil', life: 1500 });
      console.log(resp);
      toggleLoading(false);
      setLogout!();
    }).catch(e => {
      toggleLoading(false);
      toast.current?.show({ severity: `error`, summary: 'Logout Gagal', detail: e.toString(), life: 1500 });
    })
  }, [auth, setLogout]);

  return (
    user !== null && login ?
      <div style={{ background: 'var(--surface-500)', height: '100%' }} className="p-p-3">
        <Toast ref={toast} />
        <Card
          title={
            <div className="p-grid">
              <div className="p-col-11">
                <h5>{user.name}</h5>
              </div>
              <div className="p-col">                
                <Button onClick={logout} icon={`pi ${loading ? 'pi-spin pi-spinner' : 'pi-fw pi-sign-out'}`} className="p-button-danger p-button-sm p-button-rounded" />
              </div>
            </div>
          }
          className={user.type === 'Administrator' ? "h-100 overflow-hidden" : ''}
        >
          {
            user.type === 'Administrator' &&
            <div style={{ height: 'calc(100%)', overflow: 'hidden' }}>
              <TabMenu activeItem={menuItems.find(item => item.target === pathname)} onTabChange={navigate} model={menuItems} />
              <Suspense fallback={<></>}>
                <Route path={`${path}/pengguna`} component={Users} />
                <Route path={`${path}/tipe-point`} component={TypesPage} />
                <Route path={`${path}/map-editor`} component={MapEditor} />
              </Suspense>
            </div>
          }
          {
            user.type === 'Contributor' &&
            <>
            </>
          }
        </Card>
      </div>
      :
      <>
        <Redirect to="/login" />
      </>
  )
}
