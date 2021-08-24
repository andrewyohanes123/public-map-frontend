import { FC, ReactElement, useCallback, useContext, useRef, useEffect, useState } from "react"
import { Toast } from "primereact/toast";
import { ModelsContext } from "../../contexts/ModelsContext";
import AddMangroveType from "./AddMangroveType"
import { MangroveTypeAttributes } from "../../types/Types";
import MangroveList from "./MangroveList";

const MangroveType: FC = (): ReactElement => {
  const [types, setTypes] = useState<MangroveTypeAttributes[]>([]);
  const [type, setType] = useState<MangroveTypeAttributes | undefined>(undefined);
  const { models } = useContext(ModelsContext);
  const { MangroveType } = models!;
  const toast = useRef<Toast>(null);

  document.title = "Dashboard - Tipe Mangrove"

  const getTypes: () => void = useCallback(() => {
    MangroveType.collection({
      attributes: ['id', 'name'],
      order: [['id', 'asc']]
    }).then(resp => {
      setTypes(resp.rows as MangroveTypeAttributes[]);
    }).catch(e => {
      toast.current?.show({ severity: 'danger', summary: 'Tejadi kesalahan', detail: e.toString() });
    })
  }, [toast, MangroveType]);

  useEffect(() => {
    getTypes();
  }, [getTypes])

  const createType: (val: { name: string }, cb: () => void) => void = useCallback((val: { name: string }, cb: () => void) => {
    MangroveType.create({ ...val }).then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Data berhasil ditambah', detail: `Tipe mangrove ${resp.name} berhasil ditambah` });
      cb();
      getTypes();
    }).catch(e => {
      toast.current?.show({ severity: 'danger', summary: 'Tejadi kesalahan', detail: e.toString() });
    })
  }, [MangroveType, toast, getTypes]);

  const updateType: (val: { name: string }, cb: () => void) => void = useCallback((val: { name: string }, cb: () => void) => {
    if (type) {
      type.update({ ...val }).then(resp => {
        toast.current?.show({ severity: 'success', summary: 'Tipe berhasil disimpan', detail: `Tipe mangrove ${resp.name} berhasil disimpan` });
        cb();
        getTypes();
      }).catch(e => {
        toast.current?.show({ severity: 'danger', summary: 'Tejadi kesalahan', detail: e.toString() });
      })
    }
  }, [type, toast, getTypes]);

  const deleteType = useCallback((type: MangroveTypeAttributes) => {
    type.delete().then(resp => {
      toast.current?.show({ severity: 'success', summary: 'Tipe berhasil disimpan', detail: `Tipe mangrove ${resp.name} berhasil disimpan` });
      getTypes();
    }).catch(e => {
      toast.current?.show({ severity: 'danger', summary: 'Tejadi kesalahan', detail: e.toString() });
    })
  }, [getTypes, toast])

  return (
    <div className="p-p-2 p-py-3">
      <Toast ref={toast} />
      <AddMangroveType type={type} onClose={() => {
        setType(undefined);
        console.log('test')
        }} onSubmit={type ? updateType : createType} />
      <MangroveList onEdit={setType} types={types} onDelete={deleteType} />
    </div>
  )
}

export default MangroveType
