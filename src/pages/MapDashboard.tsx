import { FC, ReactElement, useContext, useCallback, lazy, Suspense, useRef, useState } from 'react'
import { useRouteMatch, Route, Redirect } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { UserContext } from '../contexts/UserContext'
import { MainPage } from './MainPage'

const Points = lazy(() => import('./Points').then(m => ({ default: m.Points })));
const AddPoint = lazy(() => import('./AddPoint').then(m => ({ default: m.AddPoint })));
const PointDetail = lazy(() => import('./PointDetail').then(m => ({ default: m.PointDetail })));

export const MapDashboard: FC = (): ReactElement => {
  const { user, login, setLogout, auth } = useContext(UserContext);
  const { path } = useRouteMatch();
  const toast = useRef<Toast>(null);
  const [loading, toggleLoading] = useState<boolean>(false);

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
        <Menubar start={user.name} end={<Button onClick={logout} icon={`pi ${loading ? 'pi-spin pi-spinner' : 'pi-fw pi-sign-out'}`} className="p-button-sm p-button-danger p-button-rounded" />} />
        <div style={{ width: '100%', height: 'calc(100% - 55.7px + 8px - 16px)', background: 'var(--surface-100)', borderRadius: 8, overflow: 'hidden', padding: 0, margin: 0 }} className="p-mt-2 p-shadow-3">
          <div style={{ margin: 0 }} className="p-grid h-100">
            <div style={{ background: 'var(--surface-400)', padding: 0, }} className="p-col-3 h-100">
              <Suspense fallback={<></>}>
                <Route path={`${path}/`} exact component={Points} />
                <Route path={`${path}/tambah-lokasi`} exact component={AddPoint} />
                <Route path={`${path}/lokasi/:id`} exact component={PointDetail} />
              </Suspense>
            </div>
            <div className="p-col-9 h-100" style={{ padding: 0 }}>
              <MainPage />
            </div>
          </div>
        </div>
      </div>
      :
      <>
        <Redirect to="/login" />
      </>
  )
}
