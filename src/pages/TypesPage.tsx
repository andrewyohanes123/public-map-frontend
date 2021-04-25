import { FC, ReactElement, useState, useCallback, useContext, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { AddTypes } from '../components/AddTypes'
import { ModelsContext } from '../contexts/ModelsContext';
import { Type } from '../types/Types';
import { TypeCard } from '../components/TypeCard';

export const TypesPage: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [limit] = useState<number>(10);
  const [page] = useState<number>(1);
  const [types, setTypes] = useState<{ rows: Type[], count: number }>({ rows: [], count: 0 });
  const [type, setType] = useState<Type | undefined>(undefined);
  const { models } = useContext(ModelsContext);
  const toast = useRef<Toast>(null);
  const { Type } = models!;

  document.title = "Dashboard - Tipe Point";

  const getTypes = useCallback(() => {
    const offset = (page - 1) * limit;
    Type.collection({
      limit,
      offset,
      attributes: ['name', 'icon', 'color'],
      order: [['id', 'asc']]
    }).then(resp => {
      setTypes({ rows: resp.rows as Type[], count: resp.count });
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString(), life: 2500 });
    });
  }, [page, limit, Type]);

  const createType = useCallback((val: any, cb: () => void) => {
    Type.create(val).then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Berhasil Menambah Data', detail: `Tipe ${resp.name} berhasil dibuat` });
      toggleModal(false);
      cb();
      getTypes();
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString(), life: 2500 });
    })
  }, [Type, getTypes]);

  const updateType = useCallback((val: any, cb: () => void) => {
    console.log('fired')
    if (typeof type !== 'undefined') {
      type.update(val).then(resp => {
        toast.current?.show({ severity: 'success', summary: 'Berhasil Mengubah Data', detail: `Tipe ${type.name} berhasil diubah ${resp.name}` });
        toggleModal(false);
        setType(undefined);
        cb();
        getTypes();
      }).catch(e => {
        toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString(), life: 2500 });
      });
    }
  }, [type, getTypes])

  useEffect(() => {
    getTypes();
  }, [getTypes])


  return (
    <div style={{ overflowY: 'scroll', height: '100%' }} className="p-p-2">
      <Toast ref={toast} />
      <Button label="Tambah tipe" className="p-mb-2" onClick={() => toggleModal(true)} />
      {
        types.rows.length > 0 ?
          <div className="p-grid p-mt-2">
            {
              types.rows.map(row => (
                <TypeCard onEdit={(type) => {
                  setType(type);
                  toggleModal(true);
                }} type={row} key={row.id} />
              ))
            }
          </div>
          :
          <div className="p-d-flex p-flex-column p-jc-center p-ai-center p-p-4">
            <i className="pi pi-fw pi-inbox p-text-center" style={{ fontSize: 80 }}></i>
            <p className="p-text-center p-mt-3" style={{ color: 'var(--text-color-secondary)' }} >Belum ada tipe point</p>
            <Button onClick={() => toggleModal(true)} label="Tambah tipe point" className="p-button-sm p-mt-3" />
          </div>
      }
      <AddTypes
        type={type}
        visible={modal}
        onHide={() => {
          setType(undefined);
          toggleModal(false);
        }}
        onSubmit={typeof type !== 'undefined' ? updateType : createType}
      />
    </div>
  )
}
