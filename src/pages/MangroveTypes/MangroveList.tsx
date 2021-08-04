import { FC, ReactElement, useCallback, MouseEvent } from "react"
import { Card } from 'primereact/card'
import { Button } from "primereact/button"
import { confirmPopup } from "primereact/confirmpopup"
import { MangroveTypeAttributes } from "../../types/Types"

interface props {
  types: MangroveTypeAttributes[];
  onEdit: (type: MangroveTypeAttributes) => void;
  onDelete: (type: MangroveTypeAttributes) => void;
}

const MangroveList: FC<props> = ({ types, onEdit, onDelete }): ReactElement => {

  const deleteConfirm = useCallback((event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, type: MangroveTypeAttributes) => {
    console.log(event, type)
    confirmPopup({
      target: event.currentTarget,
      message: `Apakah Anda yakin ingin menghapus ${type.name}?`,
      accept: () => onDelete(type),
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      acceptClassName: 'p-button-danger p-button-sm',
      rejectClassName: 'p-button-sm',
    })
  }, [onDelete]);

  return (
    <>
      {
        types.map(type => (
          <Card className="p-my-2" key={`${type.id}${type.name}`}>
            <div className="p-d-flex p-d-flex-column p-jc-between p-ai-center">
              <div>
                <h4>{type.name}</h4>
              </div>
              <div>
                <Button onClick={() => onEdit(type)} icon="pi pi-pencil" className="p-button-warning p-button-sm" />
                <Button icon="pi pi-trash" onClick={e => deleteConfirm(e, type)} className="p-button-danger p-button-sm p-ml-2" />
              </div>
            </div>
          </Card>
        ))
      }
    </>
  )
}

export default MangroveList
