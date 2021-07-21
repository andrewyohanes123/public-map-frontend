import { FC, ReactElement, useCallback, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { SelectItem } from 'primereact/api'
import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'

export interface AddUserProps {
  onSubmit: (val: User, cb: () => void) => void;
  user?: User;
  visible: boolean;
  onHide: () => void;  
}

type User = {
  id?: number;
  username: string;
  name: string;
  password?: string;
  type: 'Administrator' | 'Contributor';
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Masukkan nama lengkap'),
  username: yup.string().required('Masukkan username'),
  password: yup.string().required('Masukkan password'),
  type: yup.string().required('Pilih tipe pengguna'),
})

const editValidationSchema = yup.object().shape({
  name: yup.string().required('Masukkan nama lengkap'),
  username: yup.string().required('Masukkan username'),
  type: yup.string().required('Pilih tipe pengguna'),
})

const options: SelectItem[] = [
  { value: 'Administrator', label: 'Administrator' },
  { value: 'Contributor', label: 'Contributor' }
]

export const AddUser: FC<AddUserProps> = ({ onSubmit, visible, onHide, user }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);

  const onFinish = useCallback((val: User, helpers: FormikHelpers<User>) => {
    toggleLoading(true);
    onSubmit(val, () => {
      helpers.resetForm();
      toggleLoading(false);
    })
  }, [onSubmit]);

  return (
    <Sidebar position="top" className="p-sidebar-lg" onHide={onHide} visible={visible}>
      <h3 className="p-d-block p-mb-3">{typeof user !== 'undefined' ? `Edit ${user.name}` : 'Tambah Pengguna'}</h3>
      <Formik
        key={typeof user !== 'undefined' ? user.id : 120}
        initialValues={typeof user !== 'undefined' ? {name: `${user.name}`, username: user.username, type: user.type} : { name: '', username: '', password: '', type: 'Administrator' }}
        onSubmit={onFinish}
        validationSchema={typeof user !== 'undefined' ? editValidationSchema : validationSchema}
      >
        {({ handleSubmit, values, touched, handleBlur, handleChange, errors }) => (
          <form className="p-d-block" onSubmit={handleSubmit}>
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
            <div className="p-field p-d-block p-fluid">
              <label htmlFor="password" className={`p-d-block ${touched.password && errors.password ? 'p-error' : ''}`}>Tipe Pengguna</label>
              <span className="p-input-icon-right">
                {loading && <i className="pi pi-spin pi-spinner"></i>}
                <Dropdown name="type" options={options} onBlur={handleBlur} onChange={handleChange} value={values.type} />
              </span>
              {(touched.password && errors.password) && <small className="p-error p-d-block">{errors.password}</small>}
            </div>
            <div className="p-field p-d block p-fluid">
              <Button icon={loading ? "pi pi-spin pi-spinner" : undefined} label={typeof user !== 'undefined' ? "Simpan" : "Tambah Pengguna"} className="p-button-success" />
            </div>
          </form>
        )}
      </Formik>
    </Sidebar>
  )
}
