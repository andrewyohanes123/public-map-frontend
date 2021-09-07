import { Formik, FormikHelpers } from "formik"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { FC, ReactElement, useCallback, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import * as yup from 'yup'
import { ModelsContext } from "../contexts/ModelsContext"

const validationSchema = yup.object().shape({
  name: yup.string().required('Masukkan nama lengkap'),
  username: yup.string().required('Masukkan username'),
  password: yup.string().required('Masukkan password'),
});

type User = {
  username: string;
  name: string;
  password: string;
}

const Register: FC = (): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const { models } = useContext(ModelsContext);
  const { User } = models!;
  const toast = useRef<Toast>();
  const { push } = useHistory();

  const register = useCallback((val: User, helpers: FormikHelpers<User>) => {
    toggleLoading(true);
    console.log('object')
    User.create({ ...val, type: 'Contributor' }).then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Registrasi berhasil', detail: `Registrasi pengguna atas nama ${resp.name} berhasil` })
      helpers.resetForm();
      toggleLoading(false);
      push('/login');
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi kesalahan', detail: e.toString() })
    })
  }, [User, push]);

  return (
    <div style={{ backgroundColor: 'var(--surface-500)' }} className="centered-items">
      <Toast />
      <Link className="p-p-3" style={{ background: 'var(--surface-600)', position: 'fixed', right: 15, top: 15, borderRadius: 8, color: 'var(--text-color)', textDecoration: 'none' }} to="/">
        <p><i className="pi pi-fw pi-user"></i>&nbsp;Peta</p>
      </Link>
      <Card title="Registrasi Pengguna Map" className="p-fluid">
        <div style={{ minWidth: 500 }} className="p-fluid">
          <Formik
            initialValues={{ username: '', password: '', name: '' }}
            validationSchema={validationSchema}
            onSubmit={register}
          >
            {({ values, handleSubmit, errors, handleBlur, handleChange, touched }) => (
              <form onSubmit={handleSubmit}>
                <div className="p-field p-d-block p-fluid">
                  <label htmlFor="name" className={`p-d-block ${touched.name && errors.name ? 'p-error' : ''}`}>Nama</label>
                  <span className="p-input-icon-right">
                    {loading && <i className="pi pi-spin pi-spinner"></i>}
                    <InputText name="name" id="name" onChange={handleChange} value={values.name} onBlur={handleBlur} className={`p-d-block ${touched.name && errors.name ? 'p-invalid' : ''}`} placeholder="Masukkan nama" />
                  </span>
                  {(touched.name && errors.name) && <small className="p-error p-d-block">{errors.name}</small>}
                </div>
                <div className="p-field p-d-block p-fluid">
                  <label htmlFor="username" className={`p-d-block ${touched.username && errors.username ? 'p-error' : ''}`}>Username</label>
                  <span className="p-input-icon-right">
                    {loading && <i className="pi pi-spin pi-spinner"></i>}
                    <InputText name="username" id="username" onChange={handleChange} value={values.username} onBlur={handleBlur} className={`p-d-block ${touched.username && errors.username ? 'p-invalid' : ''}`} placeholder="Masukkan username" />
                  </span>
                  {(touched.username && errors.username) && <small className="p-error p-d-block">{errors.username}</small>}
                </div>
                <div className="p-field p-d-block p-fluid">
                  <label htmlFor="password" className={`p-d-block ${touched.password && errors.password ? 'p-error' : ''}`}>Password</label>
                  <span className="p-input-icon-right">
                    {loading && <i className="pi pi-spin pi-spinner"></i>}
                    <InputText name="password" type="password" id="password" onChange={handleChange} value={values.password} onBlur={handleBlur} className={`p-d-block ${touched.password && errors.password ? 'p-invalid' : ''}`} placeholder="Masukkan password" />
                  </span>
                  {(touched.password && errors.password) && <small className="p-error p-d-block">{errors.password}</small>}
                </div>
                <div className="p-field p-d-block p-mt-1">
                  <Button type="submit" label="Daftar"></Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  )
}

export default Register
