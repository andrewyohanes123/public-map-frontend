import { createContext, useReducer, FC, ReactElement } from 'react'
import { Map } from 'mapbox-gl'

export interface mapInstanceReducerArgs {
  type: 'SET_MAP',
  payload: Map
}

export interface mapInstanceReducerValues {
  map?: Map;
  setMap?: (map: Map) => void;
}

export const MapInstance = createContext<mapInstanceReducerValues>({});

export const MapInstanceProvider: FC = ({ children }): ReactElement => {
  const [state, dispatch] = useReducer(mapInstanceReducer, { map: undefined, setMap: undefined });

  const setMap = (map: Map): void => {
    dispatch({
      type: 'SET_MAP',
      payload: map
    })
  }

  return (
    <MapInstance.Provider value={{...state, setMap}}>
      {children}
    </MapInstance.Provider>
  )
}

const mapInstanceReducer = (state: mapInstanceReducerValues, { type, payload }: mapInstanceReducerArgs): mapInstanceReducerValues => {
  switch (type) {
    case 'SET_MAP':
      return { ...state, map: payload };
  }
}