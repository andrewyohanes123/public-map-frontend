import { FC, ReactElement, useMemo } from 'react'

import { Map } from '../pages/MainPage';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;
export const MapEditor: FC = (): ReactElement => {
  const center: [number, number] = useMemo(() => ([125.12217564443125, 1.4406812288395177]), []);
  const zoom: [number] = useMemo(() => ([15]), []);

  return (
    <div style={{ height: '100%' }}>
      <Map
        // eslint-disable-next-line
        style={{
          sources: {
            land: {
              type: 'geojson',
              data: `${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/map/base`,              
            },
          },
          layers: [
            {
              id: 'ocean',
              type: 'background',
              paint: {
                'background-color': '#539adb'
              }
            },
            {
              id: 'land',
              source: 'land',
              // 'source-layer': 'land',
              type: 'fill',
              paint: {
                'fill-color': '#dfdfdf',
                'fill-opacity': 1,
              },
              layout: {
                visibility: 'visible'
              },
              // minzoom: 13  
            },
          ],
          name: 'EMPTY',
          version: 8,
        }}
        center={center}
        zoom={zoom}
        containerStyle={{ width: '100%', height: 600 }}
      />
    </div>
  )
}
