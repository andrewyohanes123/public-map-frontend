import { FC, ReactElement, useContext, useCallback, useEffect, useState } from 'react';
import AuthProvider from '@edgarjeremy/sirius.adapter/dist/libs/AuthProvider';
import Sirius, { IModelFactory } from '@edgarjeremy/sirius.adapter'
import { ProgressSpinner } from 'primereact/progressspinner';
import { HashRouter, Route, Switch } from 'react-router-dom'
import Primereact from 'primereact/api'
import moment from 'moment';
import { MainPage } from './pages/MainPage';
import { ModelsContext, ModelsContextAttributes } from './contexts/ModelsContext';
import { UserContext, UserAttributes, UserContextAttributes } from './contexts/UserContext';
import { MapInstanceProvider } from './contexts/MapInstanceContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MapDashboard } from './pages/MapDashboard';
import './App.css';
import 'primereact/resources/themes/arya-blue/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css'
import 'mapbox-gl/dist/mapbox-gl.css';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;
const Adapter = new Sirius(REACT_APP_IP_ADDRESS!, parseInt(REACT_APP_PORT!), localStorage);

Primereact.ripple = false;

const App: FC = (): ReactElement => {
  moment.locale('id');
  const [localModels, setLocalModels] = useState<IModelFactory | {}>({});
  const [loading, toggleLoading] = useState<boolean>(true);
  const [error, toggleError] = useState<boolean>(false);
  const { setModels } = useContext<ModelsContextAttributes>(ModelsContext);
  const { setAuth, setLogin, setLogout, auth, user } = useContext<UserContextAttributes>(UserContext);

  document.title = "Public Map"

  const connect = useCallback(() => {
    toggleLoading(true);
    Adapter.connect().then(models => {
      setLocalModels(models);
      toggleError(false);
      console.log('connect')
    }).catch(e => {
      console.log(e);
      toggleError(true);
      document.title = "Oops... terjadi kesalahan. Silakan coba lagi"
    })
  }, [toggleError, setLocalModels]);

  useEffect(() => {
    connect();
  }, [connect]);
  // eslint-disable-next-line
  useEffect(() => {
    if (typeof auth !== 'undefined') {
      Adapter.getAuthProvider().get().then((user: UserAttributes): void => {
        setLogin!(user)
        toggleLoading(false);
      }).catch(e => {
        console.log(e)
        setLogout!();
        toggleLoading(false);
      })
    }
    // eslint-disable-next-line
  }, [auth]);

  useEffect(() => {
    if (Object.keys(localModels).length > 0) {
      setModels!(localModels);
      const auth: AuthProvider = Adapter.getAuthProvider();
      setAuth!(auth);
    }
    // eslint-disable-next-line
  }, [localModels]);

  return (
    loading ?
      <div className="centered-items">
        <ProgressSpinner />
        <h4 style={{ display: 'block' }}>Loading</h4>
        <p style={{ display: 'block' }}>Menghubungkan aplikasi ke server</p>
      </div>
      :
      error ?
        <div>
          <h4>Terjadi kesalahan</h4>
        </div>
        :
        <MapInstanceProvider>
          <HashRouter>
            <Switch>
              <Route exact path="/" component={MainPage} />
              <Route exact path="/login" component={Login} />
              <Route path="/dashboard" component={
                user?.type === 'Administrator' ?
                  Dashboard
                  :
                  MapDashboard
              } />
            </Switch>
          </HashRouter>
        </MapInstanceProvider>
  );
}

export default App;
