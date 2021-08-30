import { FC, ReactElement, useContext, useRef, useMemo, useCallback, useEffect, memo } from 'react'
import { Toast } from 'primereact/toast'
import mapboxgl from 'mapbox-gl'
import Mapbox, { ZoomControl, ScaleControl } from 'react-mapbox-gl'
// import { useLocation } from 'react-router-dom'
import { MapInstance } from '../contexts/MapInstanceContext';
// import { PublicPoints } from './PublicPoints';
// import { SearchButton } from '../components/SearchButton';
// import { UserBadge } from '../components/UserBadge';

export const Map = Mapbox({
  accessToken: 'pk.eyJ1IjoiYW5kcmV3eW9oYW5lcyIsImEiOiJjamxsc2c3MnQweHRuM2tsMXowNXR5ZTQ5In0.H6o00Jv2W2pfGbiY7BK7Yw',
  attributionControl: false,
  logoPosition: 'bottom-left',
  minZoom: 9
});

// const { REACT_APP_MAP_URL, REACT_APP_MAP_STYLE }: NodeJS.ProcessEnv = process.env;
// const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

export const MainPage: FC = memo((): ReactElement => {
  // const { pathname } = useLocation();
  const { setMap, map } = useContext(MapInstance);
  const toast = useRef<Toast>(null);

  const center: [number, number] = useMemo(() => ([125.12217564443125, 1.4406812288395177]), []);
  const zoom: [number] = useMemo(() => ([10]), []);

  const initMap = useCallback((mapInstance: mapboxgl.Map, ev) => {
    if (typeof map === 'undefined') {
      setMap!(mapInstance);
    }
  }, [setMap, map]);

  useEffect(() => {
    return () => {
      if (typeof map !== 'undefined') {
        if (typeof setMap !== 'undefined') {
          setMap(undefined);
          console.log('unset')
        }
      }
    }
  }, [map, setMap]);

  return (
    <>
      <Toast ref={toast} />
      <Map
        //eslint-disable-next-line 
        style={
          'mapbox://styles/mapbox/satellite-v9'
        }
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        zoom={zoom}
        center={center}
        onStyleLoad={initMap}
      >
        <ZoomControl position="bottom-right" />
        <ScaleControl position="bottom-left" />
      </Map>
      {/* {pathname === '/' &&
        <>
          <SearchButton />
          <PublicPoints />
          <UserBadge />
        </>} */}
    </>
  )
})
