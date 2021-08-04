import { FC, ReactElement, useState, useCallback, useEffect } from "react"
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from "primereact/inputtext"
import { Formik, FormikHelpers } from "formik"
import * as yup from 'yup'
import { MangroveTypeAttributes } from "../../types/Types"

const validationSchema = yup.object().shape({
  name: yup.string().required('Masukkan tipe mangrove')
});

type MangroveType = {
  name: string;
}

interface props {
  onSubmit: (val: MangroveType, cb: () => void) => void;
  type?: MangroveTypeAttributes;
  onClose: () => void;
}

const AddMangroveType: FC<props> = ({ onSubmit, type, onClose }): ReactElement => {
  const [dialog, toggleDialog] = useState<boolean>(false);
  const [loading, toggleLoading] = useState<boolean>(false);

  const onFinish = useCallback((val: MangroveType, helpers: FormikHelpers<MangroveType>) => {
    toggleLoading(true);
    onSubmit(val, () => {
      helpers.resetForm();
      toggleLoading(false);
      toggleDialog(false);
    });
  }, [onSubmit]);

  useEffect(() => {
    type && toggleDialog(true);
  }, [type]);

  useEffect(() => {
    !dialog && onClose()
  }, [dialog, onClose])

  return (
    <>
      <Button onClick={() => toggleDialog(true)} label="Tambah Tipe Mangrove" icon="pi pi-plus" />
      <Dialog draggable={false} style={{ width: '50vw' }} header={type ? `Edit ${type.name}` : <>Tambah Tipe</>} visible={dialog} footer={<></>} onHide={() => toggleDialog(false)}>
        <Formik initialValues={{ name: type?.name ?? '' }} key={type?.id ?? 'testing'} validationSchema={validationSchema} onSubmit={onFinish}>
          {({ handleSubmit, values, touched, handleBlur, handleChange, errors }) => (
            <form onSubmit={handleSubmit} className="p-d-block">
              <div className="p-field p-d-block p-fluid">
                <label htmlFor="name" className={`p-d-block`}>Tipe Mangrove</label>
                <span className="p-input-icon-right">
                  {loading && <i className="pi pi-spin pi-spinner"></i>}
                  <InputText
                    name="name"
                    placeholder="Tipe Mangrove"
                    id="name"
                    onChange={handleChange}
                    value={values.name}
                    onBlur={handleBlur}
                    className={`p-d-block ${touched.name && errors.name ? 'p-invalid' : ''}`}
                  />
                </span>
                {(touched.name && errors.name) && <small className="p-error p-d-block">{errors.name}</small>}
              </div>
              <div className="p-field p-d-block p-fluid">
                <Button loading={loading} type="submit" label={type ? "Simpan" : "Tambah"} />
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  )
}

export default AddMangroveType
