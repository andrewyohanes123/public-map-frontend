import { FC, ReactElement, useContext, useRef, useMemo } from 'react'
import { Toast } from 'primereact/toast'
import Mapbox, { ZoomControl, ScaleControl } from 'react-mapbox-gl'
import { useLocation } from 'react-router-dom'
import { MapInstance } from '../contexts/MapInstanceContext';
import { PublicPoints } from './PublicPoints';
import { SearchButton } from '../components/SearchButton';
import { UserBadge } from '../components/UserBadge';

const Map = Mapbox({
  accessToken: 'pk.eyJ1IjoiYW5kcmV3eW9oYW5lcyIsImEiOiJjamxsc2c3MnQweHRuM2tsMXowNXR5ZTQ5In0.H6o00Jv2W2pfGbiY7BK7Yw',
  attributionControl: false,
  logoPosition: 'bottom-left',
  minZoom: 10
});

const { REACT_APP_MAP_URL, REACT_APP_MAP_STYLE }: NodeJS.ProcessEnv = process.env;

export const MainPage: FC = (): ReactElement => {
  const { pathname } = useLocation();
  const { setMap } = useContext(MapInstance);
  const toast = useRef<Toast>(null);

  const center: [number, number] = useMemo(() => ([125.12217564443125, 1.4406812288395177]), []);
  const zoom: [number] = useMemo(() => ([13]), []);

  // const getSnapshots = useCallback(() => {
  //   Connection.get('/apis/snapshots').then((resp: AxiosResponse) => {
  //     setSnapshots(resp.data.data.rows);
  //   }).catch(e => {
  //     toast.current?.show({ severity: 'error', summary: 'Terjadi kesalahan', detail: e.toString(), life: 1500 });
  //   })
  // }, []);

  // useEffect(() => {
  //   getSnapshots();
  // }, [getSnapshots]);

  // useEffect(() => {
  //   if (typeof map !== 'undefined') {
  //     snapshots.forEach((snapshot) => {
  //       // const currentLayer = map.getLayer(`layer_${snapshot.name}`);
  //       // const currentSource = map.getSource(`source_${snapshot.name}`);
  //       // const type = typeConverter(snapshot.type)
  //       // if (typeof currentLayer === 'undefined' && typeof currentSource === 'undefined' && (snapshot.name === 'Bangunan')) {
  //       //   map.addSource(`source_${snapshot.name}`, {
  //       //     'type': 'vector', 'tiles': [`${REACT_APP_MAP_URL}/map/snapshots/${snapshot.id}/shapes/?z={z}&x={x}&y={y}&layerName=${snapshot.name}`]
  //       //   })
  //       //   map.addLayer(type === 'fill-extrusion' ? {
  //       //     'id': `layer_${snapshot.name}`,
  //       //     'type': type,
  //       //     'source-layer': `source_${snapshot.name}`,
  //       //     source: `source_${snapshot.name}`,
  //       //     'paint': {
  //       //       'fill-extrusion-color': '#bbb',
  //       //       'fill-extrusion-opacity': snapshot.opacity,
  //       //       'fill-extrusion-height': [
  //       //         'interpolate',
  //       //         ['linear'],
  //       //         ['zoom'],
  //       //         15,
  //       //         0,
  //       //         15.05,
  //       //         ['get', 'height']
  //       //       ]
  //       //     },
  //       //     minzoom: 12.5,
  //       //     layout: {
  //       //       visibility: 'none'
  //       //     }
  //       //   } : {
  //       //     'id': `layer_${snapshot.name}`,
  //       //     'type': type,
  //       //     'source-layer': `source_${snapshot.name}`,
  //       //     source: `source_${snapshot.name}`,
  //       //     'paint': {
  //       //       'line-color': `${snapshot.color}`,
  //       //       "line-opacity": snapshot.opacity,
  //       //     },
  //       //     minzoom: 13,
  //       //     layout: {
  //       //       visibility: 'none'
  //       //     }
  //       //   });
  //       // }
  //     })
  //   }
  // }, [map, snapshots])

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <Map
        //eslint-disable-nextline 
        style={`${REACT_APP_MAP_URL}/map/maps/${REACT_APP_MAP_STYLE}?port=443&secured=true`}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        zoom={zoom}
        center={center}
        onStyleLoad={(map) => setMap!(map)}
      >
        <ZoomControl position="bottom-right" />
        <ScaleControl position="bottom-left" />
      </Map>
      {pathname === '/' &&
        <>
          <SearchButton />
          <PublicPoints />
          <UserBadge />
        </>}
    </>
  )
}
