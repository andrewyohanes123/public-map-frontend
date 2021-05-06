import { FC, ReactElement, useMemo } from 'react'

import { Map } from '../pages/MainPage';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;
export const MapEditor: FC = (): ReactElement => {
  const center: [number, number] = useMemo(() => ([125.12217564443125, 1.4406812288395177]), []);
  const zoom: [number] = useMemo(() => ([13]), []);

  return (
    <div style={{ height: '100%' }}>
      <Map
        // eslint-disable-next-line
        style={{
          sources: {
            'land': {
              type: 'vector',
              url: `${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/map/base`,
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
              id: 'tc-land',
              source: 'land',
              'source-layer': 'land',
              type: 'fill',
              paint: {
                'fill-color': '#ffffff',
              }
            }
          ],
          name: 'empty',
          version: 8,
        }}
        center={center}
        zoom={zoom}
        containerStyle={{ width: '100%', height: 600 }}
      />
    </div>
  )
}
