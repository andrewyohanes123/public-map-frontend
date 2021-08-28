import { FC, ReactElement, useContext, useCallback, useState, useEffect, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { ModelsContext } from '../contexts/ModelsContext'
import { Point } from '../types/Types'
import { UserContext } from '../contexts/UserContext'
import { PointCard } from '../components/PointCard'
import { useHistory } from 'react-router'
import { UserPoints } from '../components/UserPoints'

export const Points: FC = (): ReactElement => {
  const [points, setPoints] = useState<{ rows: Point[], count: number }>({ rows: [], count: 0 });
  const [query, setQuery] = useState<string>('');
  const [loading, toggleLoading] = useState<boolean>(true);
  const {push} = useHistory();
  const toast = useRef<Toast>(null);
  const { user } = useContext(UserContext);

  const { models } = useContext(ModelsContext);
  const { Point } = models!;

  document.title = "Dashboard - Lokasi"

  const getPoints = useCallback(() => {
    toggleLoading(true);
    Point.collection({
      attributes: ['name', 'pointType', 'geometry', 'properties', 'description', 'id'],
      include: [{
        model: 'Type',
        attributes: ['name', 'icon', 'color']
      }, {
        model: 'Picture',
        attributes: ['file', 'description', 'id']
      }],
      where: {
        user_id: user?.id,
        name: {
          $iLike: `%${query}%`
        }
      },
      order: [['id', 'desc']]
    }).then(resp => {
      toggleLoading(false);
      setPoints({ rows: resp.rows as Point[], count: resp.count });
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    })
  }, [toast, Point, user, query]);
  
  useEffect(() => {
    getPoints();
  }, [getPoints]);
  
  const deletePoint = useCallback((point: Point) => {
    point.delete().then(resp => {    
      getPoints();
      toast.current?.show({ severity: 'success', summary: 'Data berhasil dihapus', detail: `Data ${resp.name} berhasil dihapus` });
    }).catch(e => {      
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    })
  }, [getPoints])

  return (
    <div style={{ height: 'calc(100%)' }}>
      <UserPoints />
      <Toast ref={toast} />
      <div className="p-p-3" style={{ borderBottom: '1px solid var(--surface-800)' }}>
        <span className="p-input-icon-right p-d-block p-fluid p-mb-3">
          <i className="pi pi-search"></i>
          <InputText value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Cari Lokasi" className="p-inputtext-sm" />
        </span>
        <div className="p-d-block p-fluid">
          <Button onClick={() => push('/dashboard/tambah-lokasi')} icon="pi pi-plus" label="Tambah Lokasi" className="p-fluid p-button-sm" />
        </div>
      </div>
      <div style={{height: 'calc(100% - 119px)'}}>
        <div className="p-p-3" style={{ height: '100%', overflow: 'auto' }}>
          {
            loading ?
              <div className="h-100 p-mt-3 p-text-center" style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <i className="pi pi-spin pi-spinner p-text-center" style={{ color: 'white', fontSize: 40 }} />
                <h3 className="p-mt-2">Loading</h3>
                <p>Mengambil data lokasi</p>
              </div>
              :
              points.rows.length > 0 ?
                points.rows.map(point => (
                  <PointCard key={point.id} onDelete={deletePoint} point={point} />
                ))
                :
                query.length > 0 ?
                <div className="p-mt-3 p-text-center" style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 'calc(100% - 20px)' }}>
                  <i className="pi pi-inbox p-text-center" style={{ color: '#ecf0f1', fontSize: 40 }} />
                  <h3 className="p-mt-2 p-mb-2">Lokasi dengan nama {query} tidak ditemukan</h3>
                  <Button label="Tambah Lokasi" className="p-button-sm" />
                </div>
                :
                <div className="p-mt-3 p-text-center" style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: 'calc(100% - 20px)' }}>
                  <i className="pi pi-inbox p-text-center" style={{ color: '#ecf0f1', fontSize: 40 }} />
                  <h3 className="p-mt-2 p-mb-2">Data Lokasi Kosong</h3>
                  <Button label="Tambah Lokasi" className="p-button-sm" />
                </div>
          }
        </div>
      </div>
    </div>
  )
}
