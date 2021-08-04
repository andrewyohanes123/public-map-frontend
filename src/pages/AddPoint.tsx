import { FC, ReactElement, useState, useCallback, useContext, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Formik, FormikHelpers } from 'formik'
import { Marker } from 'mapbox-gl'
import * as yup from 'yup'
import { FormInput } from '../components/FormInput'
import { ModelsContext } from '../contexts/ModelsContext'
import { useHistory, useParams } from 'react-router'
import { Point, Type } from '../types/Types'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputNumber } from 'primereact/inputnumber'
import { MapInstance } from '../contexts/MapInstanceContext'
import { UserContext } from '../contexts/UserContext'

const validationSchema = yup.object().shape({
  name: yup.string().required('Masukkan nama lokasi'),
  description: yup.string(),
  type_id: yup.number().required('Pilih tipe lokasii'),
  surface_area: yup.number().required('Masukkan luas daerah')
})

type initVal = { name: string, type_id?: number, description: string, surface_area: number }

const initialValues: initVal = { name: '', type_id: undefined, description: '', surface_area: 0 };

export interface AddPointProps {
  // onSubmit: (val: typeof initialValues, cb: () => void) => void;
}

export const AddPoint: FC<AddPointProps> = (): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [coords, setCoords] = useState<[number, number]>([3, 3]);
  const [point, setPoint] = useState<Point | undefined>(undefined);
  const [types, setTypes] = useState<Type[]>([]);
  const { models } = useContext(ModelsContext);
  const { map } = useContext(MapInstance);
  const { user } = useContext(UserContext);
  const { Point, Type } = models!;
  const { push } = useHistory();
  const { id } = useParams<{ id: string }>();
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
  }, [Point, user, coords, push]);

  const onUpdate = useCallback((val: initVal, formik: FormikHelpers<typeof initialValues>) => {
    toggleLoading(true);
    if (typeof point !== 'undefined') {
      point.update({
        ...val,
        longitude: coords[0],
        latitude: coords[1]
      }).then(resp => {
        toast.current?.show({ severity: 'success', summary: 'Lokasi Disimpan', detail: `Lokasi ${resp.name} berhasil disimpan` });
        push(`/dashboard`);
      }).catch(e => {
        toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
      });
    }
  }, [point, coords, push]);

  const getPoint = useCallback(() => {
    if (typeof id !== 'undefined') {
      Point.single(parseInt(id)).then(resp => {
        setPoint(resp as Point);
        console.log(resp)
        map?.setCenter([resp.longitude, resp.latitude]);
      }).catch(e => {
        toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
      });
    }
  }, [id, Point, map]);

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
    (typeof id !== 'undefined') && getPoint();
  }, [getPoint, id])

  useEffect(() => {
    const marker = new Marker({
      color: `red`,
      draggable: true,
      // ondrag: e => {

      // }
    });
    if (typeof map !== 'undefined') {
      if (typeof point !== 'undefined') {
        setCoords([point.longitude, point.latitude]);
        map.setCenter([point.longitude, point.latitude]);
        marker.setLngLat([point.longitude, point.latitude]).addTo(map)
      } else {
        setCoords([map.getCenter().lng, map.getCenter().lat]);
        marker.setLngLat(map.getCenter()).addTo(map)
      }
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
  }, [map, point]);

  return (
    <div style={{ color: 'white' }}>
      <Toast ref={toast} />
      <div className="p-p-3 p-d-flex" style={{ borderBottom: '1px solid var(--surface-700)' }}>
        <div className="p-mr-1">
          <Button onClick={() => push('/dashboard/')} className="p-button-sm" icon="pi pi-chevron-left" />
        </div>
        <div style={{ color: 'white' }} className="p-mr-2 p-pl-2 p-pt-2 p-text-center">
          {
            typeof id !== 'undefined' ?
              <p className="p-text-center">Edit Lokasi</p>
              :
              <p className="p-text-center">Tambah Lokasi</p>
          }
        </div>
      </div>
      <div className="p-p-3">
        <Formik validationSchema={validationSchema} onSubmit={typeof point !== 'undefined' ? onUpdate : onFinish} key={point?.id ?? 10} initialValues={
          typeof point !== 'undefined' ?
            { name: point.name!, type_id: point.type_id, description: point.description!, surface_area: point.surface_area }
            :
            initialValues
        }>
          {({ handleSubmit, touched, errors, values, handleBlur, handleChange, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <FormInput autoComplete="off" type="text" loading={loading} name="name" label="Nama Lokasi" touched={touched} onChange={handleChange} onBlur={handleBlur} errors={errors} values={values} />
              <div className="p-field p-d-block p-fluid">
                <label className={`${errors.surface_area && touched.surface_area ? 'p-error p-d-block' : ''}`} htmlFor="">Tipe</label>
                <InputNumber name="surface_area" value={`${values.surface_area}`.length > 0 ? parseInt(`${values.surface_area}`) : 0} mode="decimal" onBlur={handleBlur} onChange={e => setFieldValue('surface_area', e.value !== null ? e.value : 0)} suffix="km2" className={`${errors.type_id && touched.type_id ? 'p-invalid' : ''}`} />
                {(errors.type_id && touched.type_id) && <small className={`${errors.type_id && touched.type_id ? 'p-error p-d-block' : ''}`}>{errors.type_id}</small>}
              </div>
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
                <Button label={typeof id !== 'undefined' ? 'Simpan' : "Tambah"} icon={`pi pi-fw ${typeof id !== 'undefined' ? `pi-save` : 'pi-plus'}`} className="p-button-success p-button-sm p-fluid" />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}
