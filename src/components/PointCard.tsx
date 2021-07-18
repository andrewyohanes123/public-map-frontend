import { FC, ReactElement, useCallback, MouseEvent } from 'react'
import { Card } from 'primereact/card'
import { confirmPopup } from 'primereact/confirmpopup'
import { Point } from '../types/Types'
import { Button } from 'primereact/button'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'

export interface PointCardProps {
  point: Point;
  onDelete: (point: Point) => void;
}

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

export const PointCard: FC<PointCardProps> = ({ point, onDelete }): ReactElement => {
  const {push} = useHistory();

  const confirm = useCallback((evt: MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: evt.currentTarget,
      message: `Apakah Anda yakin ingin menghapus ${point.name}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: () => onDelete(point)
    })
  }, [point, onDelete]);

  const { path } = useRouteMatch()
  return (
    <div className="p-shadow-3 p-mb-2" style={{ borderTop: `6px solid ${point.type.color}`, borderRadius: 8, overflow: 'hidden' }}>
      <Card
        title={<Link style={{ color: 'white', textDecoration: 'none' }} to={`${path}lokasi/${point.id}`}><h5 className="p-text-normal">{point.name}</h5></Link>}
        subTitle={point.type.name}
        header={point.pictures!.length > 0 ? <img src={`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/picture/${point.pictures![0].id}`} alt={point.name} /> : undefined}
      >
        <Button icon="pi pi-fw pi-pencil" onClick={() => push(`/dashboard/edit-lokasi/${point.id}`)} className="p-button-warning p-button-sm p-mr-2" />
        <Button icon="pi pi-fw pi-trash" onClick={confirm} className="p-button-danger p-button-sm" />
      </Card>
    </div>
  )
}
