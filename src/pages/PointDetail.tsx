import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'
import { FC, ReactElement, useContext, useRef, useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router';
import { MapInstance } from '../contexts/MapInstanceContext';
import { ModelsContext } from '../contexts/ModelsContext';
import { Picture, Point } from '../types/Types';

export const PointDetail: FC = (): ReactElement => {
  const [point, setPoint] = useState<Point | undefined>(undefined);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const toast = useRef<Toast>(null);
  const { models } = useContext(ModelsContext);
  const { map } = useContext(MapInstance);
  const { Point: PointSingle, Picture } = models!;
  const { id } = useParams<{ id: string }>();

  const getPoint = useCallback(() => {
    if (map) {
      PointSingle.single(parseInt(id)).then(resp => {
        setPoint(resp as Point);
        map.flyTo({
          center: [resp.longitude, resp.latitude],
          zoom: 14
        })
      }).catch(e => {
        toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
      });
    }
  }, [PointSingle, id, map]);

  const getPictures = useCallback(() => {
    Picture.collection({
      attributes: ['file', 'description', 'point_id'],
      where: {
        point_id: id
      }
    }).then(resp => {
      setPictures(resp.rows as Picture[]);
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    });
  }, [Picture, id]);

  useEffect(() => {
    getPoint();
    getPictures();
  }, [getPoint, getPictures]);

  return (
    typeof point !== 'undefined' ?
      <div style={{ color: 'var(--surface-900)' }}>
        <Toast ref={toast} />
        <div className="p-p-3" style={{ height: 200, background: point.type.color }}>
          <Button icon="pi pi-fw pi-chevron-left" />
        </div>
        <div className="p-p-3">
          <h2 style={{ color: 'var(--text-color)' }} className="p-text-normal">{point.name}</h2>
          <p style={{ color: 'var(--text-color-secondary)' }}>{point.type.name}</p>
        </div>
        {pictures.length > 0 ?
          <>
          </>
          :
          <div style={{ height: 350, background: 'var(--surface-600)', borderRadius: 8 }} className="p-m-3 p-d-flex p-flex-column p-jc-center p-ai-center">
            <div style={{ background: 'var(--surface-900)', padding: '15px 10px', borderRadius: '60%', marginBottom: 5 }}>
              <i className="pi pi-fw pi-image" style={{ fontSize: 50, color: 'var(--text-color)' }}></i>
            </div>
            <h3 style={{ color: 'var(--text-color)' }}>Belum ada gambar</h3>
            <p style={{ color: 'var(--text-color-secondary)' }}>Silakan tambah gambar lokasi</p>
          </div>
        }
      </div>
      :
      <>
      </>
  )
}
