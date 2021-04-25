import { FC, ReactElement } from 'react'
import { InputText, InputTextProps } from 'primereact/inputtext'

export interface FormInputProps extends InputTextProps {
  values: { [any: string]: any };
  errors: { [any: string]: any };
  touched: { [any: string]: any };
  loading: boolean;
  name: string;
  label: string;
}

export const FormInput: FC<FormInputProps> = ({ loading, errors, onChange, name, touched, values, onBlur, label, autoComplete, type }): ReactElement => {
  return (
    <div className="p-field p-d-block p-fluid">
      <label htmlFor={name} className={`p-d-block ${touched[name] && errors[name] ? 'p-error' : ''}`}>{label}</label>
      <span className="p-input-icon-right">
        {loading && <i className="pi pi-spin pi-spinner"></i>}
        <InputText type={type} autoComplete={autoComplete} name={name} id={name} onChange={onChange} value={values[name]} onBlur={onBlur} className={`p-d-block ${touched[name] && errors[name] ? 'p-invalid' : ''}`} placeholder="Masukkan nama" />
      </span>
      {(touched[name] && errors[name]) && <small className="p-error p-d-block">{errors[name]}</small>}
    </div>
  )
}
