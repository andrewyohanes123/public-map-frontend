import { FC, ReactElement } from 'react'

import { Map } from '../pages/MainPage';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;
export const MapEditor: FC = (): ReactElement => {
  return (
    <div>
      <Map
        // eslint-disable-next-line
        style={{
          sources: {
            'land': {
              type: 'vector',
              url: `${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}`
            },
          },
          layers: [{
            id: 'land',
            source: 'land',
            'source-layer': 'land',
            type: 'fill',
            paint: {
              'fill-color': 'white',
            }
          }],
          name: 'empty',
          version: 8,
        }}
        containerStyle={{ width: '100%', height: '100$' }}
      />
    </div>
  )
}
