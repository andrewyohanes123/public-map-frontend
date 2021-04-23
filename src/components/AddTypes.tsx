import React, {useState, useCallback} from 'react'
import { Sidebar } from 'primereact/sidebar'
import {Formik, FormikHelpers} from 'formik'
import { FormInput } from './FormInput';

export interface AddTypesProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (val: any, cb: () => void) => void;
}

export const AddTypes: React.FC<AddTypesProps> = ({visible, onHide, onSubmit}): React.ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);

  const onFinish = useCallback((val: any, formik: FormikHelpers<any>) => {
    toggleLoading(true);
    onSubmit(val, () => {
      formik.resetForm();
      toggleLoading(false);
    })
  }, [onSubmit])

  return (
    <Sidebar onHide={onHide} position="top" className="p-sidebar-lg" visible={visible}>
      <Formik onSubmit={onFinish} initialValues={{name: '', icon: undefined, color: '#0984e3'}}>
        {({handleSubmit, values, touched, errors, handleBlur, handleChange}) => (
          <form onSubmit={handleSubmit}>
            <FormInput autoComplete="off" label="Tipe" onChange={handleChange} onBlur={handleBlur} name="name" errors={errors} touched={touched} loading={loading} values={values} />
          </form>
        )}
      </Formik>
    </Sidebar>
  )
}
