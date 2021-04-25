import { FC, ReactElement, useState, useCallback, useContext, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { AddTypes } from '../components/AddTypes'
import { ModelsContext } from '../contexts/ModelsContext';
import { Type } from '../types/Types';
import { Card } from 'primereact/card';

export const TypesPage: FC = (): ReactElement => {
  const [modal, toggleModal] = useState<boolean>(false);
  const [limit] = useState<number>(10);
  const [page] = useState<number>(1);
  const [types, setTypes] = useState<{ rows: Type[], count: number }>({ rows: [], count: 0 });
  const { models } = useContext(ModelsContext);
  const toast = useRef<Toast>(null);
  const { Type } = models!;

  document.title = "Dashboard - Tipe Point";

  const getTypes = useCallback(() => {
    const offset = (page - 1) * limit;
    Type.collection({
      limit,
      offset,
      attributes: ['name', 'icon', 'color']
    }).then(resp => {
      setTypes({ rows: resp.rows as Type[], count: resp.count });
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString(), life: 2500 });
    });
  }, [page, limit]);

  const createType = useCallback((val: any, cb: () => void) => {
    Type.create(val).then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: `Tipe ${resp.name} berhasil dibuat` });
      toggleModal(false);
      cb();
      getTypes();
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString(), life: 2500 });
    })
  }, [Type, getTypes]);

  useEffect(() => {
    getTypes();
  }, [getTypes])


  return (
    <div className="p-p-2">
      <Toast ref={toast} />
      <Button label="Tambah tipe" className="p-mb-2" onClick={() => toggleModal(true)} />
      {
        types.rows.map(row => (
          <Card title={row.name} ></Card>
        ))
      }
      <AddTypes
        visible={modal}
        onHide={() => toggleModal(false)}
        onSubmit={createType}
      />
    </div>
  )
}
