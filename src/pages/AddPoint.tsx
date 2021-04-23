import { FC, ReactElement, useState, useCallback, useContext, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Formik, FormikHelpers } from 'formik'
import { Marker } from 'mapbox-gl'
import * as yup from 'yup'
import { FormInput } from '../components/FormInput'
import { ModelsContext } from '../contexts/ModelsContext'
import { useHistory } from 'react-router'
import { Type } from '../types/Types'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { MapInstance } from '../contexts/MapInstanceContext'
import { Points } from './Points'
import { UserContext } from '../contexts/UserContext'
import { number } from 'yup/lib/locale'

const validationSchema = yup.object().shape({
  name: yup.string().required('Masukkan nama lokasi'),
  description: yup.string(),
  type_id: yup.number().required('Pilih tipe lokasii')
})

const initialValues = { name: '', type_id: undefined, description: '' };

export interface AddPointProps {
  onSubmit: (val: typeof initialValues, cb: () => void) => void;
}

export const AddPoint: FC<AddPointProps> = ({ }): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [types, setTypes] = useState<Type[]>([]);
  const { models } = useContext(ModelsContext);
  const { map } = useContext(MapInstance);
  const { user } = useContext(UserContext);
  const { Point, Type } = models!;
  const { push } = useHistory();
  const toast = useRef<Toast>(null);

  const onFinish = useCallback((val: typeof initialValues, formik: FormikHelpers<typeof initialValues>) => {
    toggleLoading(true)
    Point.create({
      ...val,
      user_id: user?.id,
      longitude: coords[0],
      latitude: coords[1]
    }).then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Lokasi Disimpan', detail: `Lokasi ${resp.name} berhasil disimpan` });
      push(`/dashboard`)
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    });
  }, [Point, user, coords]);

  const getTypes = useCallback(() => {
    Type.collection({
      attributes: ['name', 'icon', 'color']
    }).then(resp => {
      setTypes(resp.rows as Type[]);
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    });
  }, [Type]);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  useEffect(() => {
    const marker = new Marker({
      color: `red`,
      draggable: true,
      // ondrag: e => {

      // }
    });
    if (typeof map !== 'undefined') {
      setCoords([map.getCenter().lng, map.getCenter().lat]);
      marker.setLngLat(map.getCenter()).addTo(map)
      marker.on('dragend', () => {
        const coords = marker.getLngLat();
        setCoords([coords.lng, coords.lat]);
        map.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 13
        })
      })
    }
    return () => {
      marker.remove()
    }
  }, [map]);

  return (
    <div style={{ color: 'white' }}>
      <Toast ref={toast} />
      <div className="p-p-3 p-d-flex" style={{ borderBottom: '1px solid var(--surface-700)' }}>
        <div className="p-mr-1">
          <Button onClick={() => push('/dashboard/')} className="p-button-sm" icon="pi pi-chevron-left" />
        </div>
        <div style={{ color: 'white' }} className="p-mr-2 p-pl-2 p-pt-2 p-text-center">
          <p className="p-text-center">Tambah Lokasi</p>
        </div>
      </div>
      <div className="p-p-3">
        <Formik validationSchema={validationSchema} onSubmit={onFinish} initialValues={initialValues}>
          {({ handleSubmit, touched, errors, values, handleBlur, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <FormInput autoComplete="off" loading={loading} name="name" label="Nama Lokasi" touched={touched} onChange={handleChange} onBlur={handleBlur} errors={errors} values={values} />
              <div className="p-field p-d-block p-fluid">
                <label className={`${errors.type_id && touched.type_id ? 'p-error p-d-block' : ''}`} htmlFor="">Tipe</label>
                <Dropdown
                  value={values.type_id}
                  onChange={handleChange}
                  id="select"
                  onBlur={handleBlur}
                  options={types.map(type => ({ value: type.id, label: type.name }))}
                  name="type_id"
                  placeholder="Pilih Tipe Lokasi"
                  className={`${errors.type_id && touched.type_id ? 'p-invalid' : ''}`}
                  filter
                  filterBy="label"
                />
                {(errors.type_id && touched.type_id) && <small className={`${errors.type_id && touched.type_id ? 'p-error p-d-block' : ''}`}>{errors.type_id}</small>}
              </div>
              <div className="p-field p-d-block p-fluid">
                <label className={`${errors.type_id && touched.type_id ? 'p-error p-d-block' : ''}`} htmlFor="description">Deskripsi</label>
                <InputTextarea
                  value={values.description}
                  onChange={handleChange}
                  id="description"
                  onBlur={handleBlur}
                  style={{ resize: 'vertical' }}
                  rows={8}
                  name="description"
                  placeholder="Deskripsi Lokasi"
                  className={`${errors.type_id && touched.type_id ? 'p-invalid' : ''}`}
                />
                {(errors.type_id && touched.type_id) && <small className={`${errors.type_id && touched.type_id ? 'p-error p-d-block' : ''}`}>{errors.type_id}</small>}
              </div>
              <div className="p-field p-fluid p-d-block">
                <Button label="Tambah" icon="pi pi-fw pi-plus" className="p-button-success p-button-sm p-fluid" />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}
