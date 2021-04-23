import { Toast } from 'primereact/toast'
import { FC, ReactElement, useContext, useRef, useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router';
import { ModelsContext } from '../contexts/ModelsContext';
import { Point } from '../types/Types';

export const PointDetail: FC = (): ReactElement => {
  const [point, setPoint] = useState<Point | undefined>(undefined);
  const toast = useRef<Toast>(null);
  const { models } = useContext(ModelsContext);
  const { Point: PointSingle } = models!;
  const { id } = useParams<{ id: string }>();

  const getPoint = useCallback(() => {
    PointSingle.single(parseInt(id)).then(resp => {
      setPoint(resp as Point);
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    });
  }, [PointSingle]);

  useEffect(() => {
    getPoint();
  }, [getPoint]);

  return (
    typeof point !== 'undefined' ?
    <div style={{ color: 'var(--surface-900)' }}>
      <Toast ref={toast} />
      <h4 className="p-text-normal">{point.name}</h4>
    </div>
    :
    <>
    </>
  )
}
