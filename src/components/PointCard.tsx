import { FC, ReactElement } from 'react'
import { Card } from 'primereact/card'
import { Point } from '../types/Types'
import { Button } from 'primereact/button'
import { Link, useRouteMatch } from 'react-router-dom'

export interface PointCardProps {
  point: Point;
}

export const PointCard: FC<PointCardProps> = ({ point }): ReactElement => {
  const { path } = useRouteMatch()
  return (
    <div className="p-shadow-3 p-mb-2" style={{ borderTop: `6px solid ${point.type.color}`, borderRadius: 8, overflow: 'hidden' }}>
      <Card title={<Link style={{ color: 'white', textDecoration: 'none' }} to={`${path}lokasi/${point.id}`}><h5 className="p-text-normal">{point.name}</h5></Link>}>
        {point.pictures!.length > 0 ?
          <></>
          :
          <div className="centered-items">
            <p className="p-text-center ">Tidak ada gambar lokasi</p>
            <Button icon="pi pi-fw pi-plus" className="p-button-rounded p-button-sm p-button-success p-mt-3 p-button-outlined" />
            <small className="p-text-center p-mt-2">Tambah Gambar</small>
          </div>
        }
      </Card>
    </div>
  )
}
