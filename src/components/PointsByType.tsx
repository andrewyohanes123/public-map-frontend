import { bbox } from '@turf/turf';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FC, ReactElement, useState, useCallback, useContext, useEffect } from 'react'
import { SelectedPoint } from '../App';
import { MapInstance } from '../contexts/MapInstanceContext';
import { ModelsContext } from '../contexts/ModelsContext';
import { Point, District } from '../types/Types'
import { PublicPointCard } from './PublicPointCard';

export default interface PointsByTypeProps {
  district_id?: number;
  district: District;
  onBack?: () => void;
}

export const PointsByType: FC<PointsByTypeProps> = ({ district_id, district, onBack }): ReactElement => {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, toggleLoading] = useState<boolean>(true);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);

  const { models } = useContext(ModelsContext);
  const { Point } = models!;
  const { map } = useContext(MapInstance);
  const {setPointId, toggleSidebar} = useContext(SelectedPoint)

  const getPoints = useCallback(() => {
    if (typeof district_id !== 'undefined') {
      toggleLoading(true);
      Point.collection({
        attributes: ['name', 'geometry', 'district_id', 'id'],
        where: {
          district_id
        },
        include: [{
          model: 'Type', attributes: ['name', 'color', 'id'],
        }]
      }).then(resp => {
        setPoints(resp.rows as Point[]);
        toggleLoading(false);
      }).catch(e => {
        setRetryAttempt(retry => retry + 1);
        console.log(e);
      })
    }
  }, [Point, district_id]);

  const focusPoint = useCallback((point: Point) => {
    if (typeof map !== 'undefined') {
      const boundingBox = bbox({
        type: 'FeatureCollection',
        features: [{
          geometry: point.geometry,
          type: 'Feature',
          properties: {}
        }]
      });
      // @ts-ignore
      map.fitBounds(boundingBox, {padding: 24})
      toggleSidebar(true);
      setPointId(point.id);
    }
  }, [map, setPointId, toggleSidebar]);

  useEffect(() => {
    if (retryAttempt < 4) {
      getPoints();
    }
  }, [getPoints, retryAttempt]);

  return (
    <div className="sidebar-container p-mt-2 p-p-3 p-d-block p-fluid">
      <Button onClick={onBack} className="p-d-block p-fluid p-button-sm p-mb-2" label="Kembali" />
      {(loading && points.length > 0) ?
        <div style={{ maxHeight: 400 }} className="centered-items">
          <ProgressSpinner />
          <p className="p-mt-3">Loading data hutan</p>
        </div>
        :
        points.length > 0 ?
          points.map(point => (
            <PublicPointCard onClick={() => focusPoint(point)} point={point} key={`${point.name} - ${point.id}`} />
          ))
          :
          <div style={{ maxHeight: 400 }} className="centered-items p-p-3">
            <i className="pi pi-fw pi-map-marker" style={{ fontSize: 60, color: 'var(--text-color-secondary)' }}></i>
            <p className="p-mt-3">Tidak ada data hutan mangrove pada {district.name}</p>
          </div>
      }
    </div>
  )
}
