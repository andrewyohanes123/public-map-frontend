import React, { useState, useCallback, useEffect } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Formik, FormikHelpers } from 'formik'
import { FormInput } from './FormInput';
import Dropzone from 'react-dropzone';
import { svgColor } from '../modules/SVGColorizer';
import { Button } from 'primereact/button';
import * as yup from 'yup'
import { Type } from '../types/Types';

export interface AddTypesProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (val: any, cb: () => void) => void;
  type?: Type;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Masukkan tipe point'),
  icon: yup.string().required('Pilih file icon'),
  color: yup.string().required('Pilih warna icon')
});
const editValidationSchema = yup.object().shape({
  name: yup.string().required('Masukkan tipe point'),
  color: yup.string().required('Pilih warna icon')
});

export const AddTypes: React.FC<AddTypesProps> = ({ visible, onHide, onSubmit, type }): React.ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [key, setKey] = useState<number>(Math.random() * 1000);

  const onFinish = useCallback((val: any, formik: FormikHelpers<any>) => {
    toggleLoading(true);
    onSubmit(val, () => {
      formik.resetForm();
      toggleLoading(false);
    })
  }, [onSubmit]);

  const onDrop = useCallback((file: File[], cb: (field: string, value: any) => void, touched: (field: string, touched?: boolean) => void) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file[0]);
    fileReader.onload = () => {
      cb('icon', fileReader.result);
      touched('icon', true);
    }
  }, []);

  useEffect(() => {
    if (type) setKey(Math.random() * 10004);
  }, [type])

  return (
    <Sidebar onHide={onHide} position="top" fullScreen={true} visible={visible}>
      { typeof type !== 'undefined' ?
        <h3 className="p-mb-2">Edit {type.name}</h3>
        :
        <h3 className="p-mb-2">Tambah Tipe</h3>
        }
      {visible && <Formik key={key} validationSchema={typeof type !== 'undefined' ? editValidationSchema : validationSchema} onSubmit={onFinish} initialValues={
        typeof type !== 'undefined' ?
          {name: type.name, color: type.color}
          :
          { name: '', icon: undefined, color: '#0984e3' }
      }>
        {({ handleSubmit, values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched, submitCount }) => (
          <form className="p-d-block p-fluid" onSubmit={handleSubmit}>
            <FormInput autoComplete="off" label="Tipe" onChange={handleChange} onBlur={handleBlur} name="name" errors={errors} touched={touched} loading={loading} values={values} />
            <FormInput autoComplete="off" type="color" label="Warna Marker" onChange={handleChange} onBlur={handleBlur} name="color" errors={errors} touched={touched} loading={loading} values={values} />
            <div className="p-p-5 p-d-flex p-jc-center p-ai-center p-mb-3" style={{ borderRadius: 8, background: values.color }}>
              <p>{values.color}</p>
            </div>
            <Dropzone multiple={false} accept="image/svg+xml" onDrop={file => onDrop(file, setFieldValue, setFieldTouched)}>
              {({ getInputProps, getRootProps }) => (
                <div {...getRootProps({ className: "p-d-flex p-p-3 p-flex-column p-jc-center p-ai-center", style: { background: 'var(--surface-b)', borderRadius: 8, cursor: 'pointer' } })}>
                  <input {...getInputProps()} />
                  { typeof values.icon === 'undefined' ?
                    <>
                      <div style={{ background: 'var(--surface-900)', padding: '15px 10px', borderRadius: '60%', marginBottom: 5 }}>
                        <i className="pi pi-fw pi-image" style={{ fontSize: 50 }}></i>
                      </div>
                      <p style={{ color: 'var(--text-color-secondary)' }}>Seret file <i>icon</i> atau klik pada kotak ini</p>
                      {(errors.icon && (touched.icon || submitCount > 0)) && <p className="p-error">{errors.icon}</p>}
                    </>
                    :
                    <>
                      <img alt="icon" src={svgColor(values.icon!, values.color)} style={{ width: 100, height: 100 }} />
                      <p style={{ color: 'var(--text-color-secondary)' }}>Seret file <i>icon</i> atau klik pada kotak ini untuk mengganti icon</p>
                      <Button icon="pi pi-times" className="p-button-rounded p-button-sm p-button-danger p-button-outlined p-mt-2" onClick={(e) => {
                        setFieldValue('icon', undefined);
                        e.stopPropagation();
                      }} />
                    </>
                  }
                </div>
              )}
            </Dropzone>
            <div className="p-field p-d-block">
              <Button type="submit" className={`p-button-sm p-mt-3 p-fluid ${typeof type !== 'undefined' ? 'p-button-success' : ''}`} label={typeof type !== 'undefined' ? "Simpan" : "Tambah Tipe"} />
            </div>
          </form>
        )}
      </Formik>}
    </Sidebar>
  )
}
