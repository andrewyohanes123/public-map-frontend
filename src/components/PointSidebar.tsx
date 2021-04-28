import { ProgressSpinner } from 'primereact/progressspinner';
import { FC, ReactElement, useContext, useEffect, useCallback, useState } from 'react'
import { SelectedPoint } from '../App'
import { ModelsContext } from '../contexts/ModelsContext';
import { Point } from '../types/Types';
import { SidebarCoverImage } from './SidebarCoverImage';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;
export const PointSidebar: FC = (): ReactElement => {
  const { point_id, sidebar } = useContext(SelectedPoint);
  const { models } = useContext(ModelsContext);
  const [point, setPoint] = useState<Point | undefined>();
  const [loading, toggleLoading] = useState<boolean>(true);
  const [retry, setRetry] = useState<number>(0);
  const { Point } = models!;

  const getPointDetail = useCallback(() => {
    if (typeof point_id !== 'undefined') {
      toggleLoading(true);
      Point.single(point_id).then(resp => {
        setPoint(resp as Point);
        toggleLoading(false);
      }).catch(e => {
        console.log(e);
        setRetry(retry => retry + 1);
      })
    }
  }, [point_id, Point]);

  useEffect(() => {
    if (retry < 5) {
      getPointDetail();
    }
  }, [retry, getPointDetail]);

  return (
    sidebar ?
      <div className="sidebar-container p-mt-2">
        {(loading || typeof Point === 'undefined') ?
          <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
            <ProgressSpinner />
            <p className="p-text-center">Loading Detail</p>
          </div>
          :
          <div className="p-p-3">
            {(point!.pictures!.length > 0) && <SidebarCoverImage src={`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/picture/${point?.pictures![0].id}`} />}
            <h3>{point?.name}</h3>
            <p style={{ color: 'var(--text-color-secondary)' }}>{point?.type.name}</p>
            {point?.pictures?.length === 0 ?
              <div className="p-d-flex p-flex-column p-jc-center p-ai-center p-mt-3">
                <i className="pi pi-fw pi-image" style={{ fontSize: 50, color: 'var(--text-color-secondary)' }}></i>
                <p style={{ color: 'var(--text-color-secondary)' }} className="p-text-center">Tidak ada gambar</p>
              </div>
              :
              <>
              <h4 className="p-mt-2 p-mb-2">{point!.pictures!.length > 1 ? 'Foto - Foto' : 'Foto'}</h4>
              {point?.pictures?.map(picture => (
                <SidebarCoverImage key={picture.id} src={`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/picture/${picture.id}`} />
              ))}
              </>
            }
          </div>
        }
      </div>
      :
      <>
      </>
  )
}
