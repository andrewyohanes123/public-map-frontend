import { FC, ReactElement } from 'react'
import { Point } from '../types/Types'

export interface PublicPointCardProps {
  point: Point;
  onClick?: () => void;
}
const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;
export const PublicPointCard: FC<PublicPointCardProps> = ({ point, onClick }): ReactElement => {
  return (
    <div onClick={onClick} className="p-d-flex p-mt-2 p-mb-2 p-ai-center p-shadow-2 p-p-3 public-point-card">
      <div className="p-mr-3" style={{ borderRadius: 8, width: 60, height: 60, overflow: 'hidden' }}>
        {
          point.pictures!.length > 0 ?
          <img src={`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/picture/${point.pictures![0].id}`} style={{ height: '100%', width: 'auto' }} alt={point.name} />
          :
          <div style={{ width: 60, height: 60, background: point.type.color }}></div>
        }
      </div>
      <div className="p-d-flex p-flex-column p-jc-center">
        <h3 className="p-text-normal">{point.name}</h3>
        <p>{point.type.name}</p>
      </div>
    </div>
  )
}
