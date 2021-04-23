import { FC, ReactElement, useCallback, useContext } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Formik } from 'formik'
import * as yup from 'yup'
import {Redirect} from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

const validationSchema = yup.object().shape({
  username: yup.string().required('Masukkan username'),
  password: yup.string().required('Masukkan password')
});

export const Login: FC = (): ReactElement => {
  const { auth, setLogin, login: loggedIn } = useContext(UserContext);

  const login = useCallback(
    ({ username, password }: { username: string, password: string }) => {
      console.log({ username, password })
      auth?.set({ username, password })
        .then(resp => {
          setLogin!(resp);
        }).catch(e => {
          console.log(e);
        })
    },
    [auth, setLogin])

  return (
    loggedIn ?
    <Redirect to="/dashboard" />
    :
    <div style={{ backgroundColor: 'var(--surface-500)' }} className="centered-items">
      <Card title="Login Public Map" className="p-fluid">
        <div style={{ minWidth: 500 }} className="p-fluid">
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={login}
          >
            {({ values, handleSubmit, errors, handleBlur, handleChange, touched }) => (
              <form onSubmit={handleSubmit}>
                <div className="p-field">
                  <label htmlFor="username" className={`p-d-block ${touched.username && errors.username ? 'p-error' : ''}`}>Username</label>
                  <InputText
                    value={values.username}
                    autoComplete="off"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="username"
                    id="username"
                    placeholder="Username"
                    className={`p-d-block ${touched.username && errors.username ? 'p-invalid' : ''}`}
                  />
                  {(errors.username && touched.username) && <small className="p-error p-d-block">{errors.username}</small>}
                </div>
                <div className="p-field">
                  <label htmlFor="password" className={`p-d-block ${touched.password && errors.password ? 'p-error' : ''}`}>Password</label>
                  <InputText
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    id="password"
                    name="password"
                    type="password"
                    className={`p-d-block ${touched.password && errors.password ? 'p-invalid' : ''}`}
                    placeholder="Password"
                  />
                  {(errors.password && touched.password) && <small className="p-error p-d-block">{errors.password}</small>}
                </div>
                <div className="p-field p-d-block p-mt-1">
                  <Button type="submit" label="Login"></Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  )
}
