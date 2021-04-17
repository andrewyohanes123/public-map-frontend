import { FC, ReactElement, useContext, useCallback, useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast'
import Mapbox, { ZoomControl, ScaleControl } from 'react-mapbox-gl'
import { MapInstance } from '../contexts/MapInstanceContext';
import { AxiosResponse, Connection } from '../modules/Connection';
import { Snapshot } from '../types/Types';

const Map = Mapbox({
  accessToken: 'pk.eyJ1IjoiYW5kcmV3eW9oYW5lcyIsImEiOiJjamxsc2c3MnQweHRuM2tsMXowNXR5ZTQ5In0.H6o00Jv2W2pfGbiY7BK7Yw',
  attributionControl: false,
  logoPosition: 'bottom-left',
  minZoom: 12
});

const { REACT_APP_MAP_URL, REACT_APP_MAP_STYLE }: NodeJS.ProcessEnv = process.env;

export const MainPage: FC = (): ReactElement => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const { setMap, map } = useContext(MapInstance);
  const toast = useRef<Toast>(null);

  const getSnapshots = useCallback(() => {
    Connection.get('/apis/snapshots').then((resp: AxiosResponse) => {
      setSnapshots(resp.data.data.rows);
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi kesalahan', detail: e.toString(), life: 1500 });
    })
  }, []);

  useEffect(() => {
    getSnapshots();
  }, [getSnapshots]);

  useEffect(() => {
    if (typeof map !== 'undefined') {
      snapshots.forEach((snapshot) => {
        const currentLayer = map.getLayer(`layer_${snapshot.name}`);
        const currentSource = map.getSource(`source_${snapshot.name}`);
        const type = typeConverter(snapshot.type)
        if (typeof currentLayer === 'undefined' && typeof currentSource === 'undefined' && (snapshot.name === 'Bangunan')) {
          map.addSource(`source_${snapshot.name}`, {
            'type': 'vector', 'tiles': [`${REACT_APP_MAP_URL}/map/snapshots/${snapshot.id}/shapes/?z={z}&x={x}&y={y}&layerName=${snapshot.name}`]
          })
          map.addLayer(type === 'fill-extrusion' ? {
            'id': `layer_${snapshot.name}`,
            'type': type,
            'source-layer': `source_${snapshot.name}`,
            source: `source_${snapshot.name}`,
            'paint': {
              'fill-extrusion-color': '#bbb',
              'fill-extrusion-opacity': snapshot.opacity,
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ]
            },
            minzoom: 12.5,
            layout: {
              visibility: 'none'
            }
          } : {
            'id': `layer_${snapshot.name}`,
            'type': type,
            'source-layer': `source_${snapshot.name}`,
            source: `source_${snapshot.name}`,
            'paint': {
              'line-color': `${snapshot.color}`,
              "line-opacity": snapshot.opacity,
            },
            minzoom: 13,
            layout: {
              visibility: 'none'
            }
          });
        }
      })
    }
  }, [map, snapshots])

  const typeConverter = (type: 'Polygon' | 'LineString'): 'fill-extrusion' | 'line' => {
    switch (type) {
      case 'Polygon':
        return 'fill-extrusion';
      case 'LineString':
        return 'line';
      default:
        return 'fill-extrusion'
    }
  }

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <Map
        //eslint-disable-nextline 
        style={`${REACT_APP_MAP_URL}/map/maps/${REACT_APP_MAP_STYLE}?port=443&secured=true`}
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
        zoom={[13]}
        center={[124.86218331706851, 1.4847125213695158]}
        onStyleLoad={(map) => setMap!(map)}
      >
        <ZoomControl position="bottom-right" />
        <ScaleControl position="bottom-left" />
      </Map>
    </>
  )
}
