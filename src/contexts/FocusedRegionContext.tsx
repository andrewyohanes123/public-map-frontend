import { createContext, FC, ReactElement, useReducer, useCallback } from 'react'
import { District, Subdistrict, Neighbor } from '../types/Types';

export interface RegionSelectorTypes {
  region?: District | Subdistrict | Neighbor;
  setRegion?: (region: District | Subdistrict | Neighbor) => void;
  unsetRegion?: () => void;
}

export interface regionSelectorReducerArgs {
  type: 'SET_REGION' | 'UNSET_REGION',
  payload?: District | Subdistrict | Neighbor;
}

export const RegionSelector = createContext<RegionSelectorTypes>({});

export const RegionSelectorProvider: FC = ({ children }): ReactElement => {
  const [state, dispatch] = useReducer(regionSelectorReducer, { region: undefined, setRegion: undefined, unsetRegion: undefined });

  const setRegion = useCallback((payload: District | Subdistrict | Neighbor) => {
    dispatch({
      type: 'SET_REGION',
      payload
    });
  }, [state, dispatch]);

  const unsetRegion = useCallback(() => {
    dispatch({
      type: 'UNSET_REGION',
      payload: undefined
    });
  }, [])

  return (
    <RegionSelector.Provider value={{ ...state, setRegion, unsetRegion }}>
      {children}
    </RegionSelector.Provider>
  )
}

const regionSelectorReducer = (state: RegionSelectorTypes, { type, payload }: regionSelectorReducerArgs): RegionSelectorTypes => {
  switch (type) {
    case 'SET_REGION':
      return { ...state, region: payload };
    case 'UNSET_REGION':
      return { ...state, region: undefined };
  }
}