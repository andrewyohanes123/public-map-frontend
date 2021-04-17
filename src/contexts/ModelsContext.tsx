import React, { useReducer, createContext } from 'react'
import { IModelFactory } from '@edgarjeremy/sirius.adapter';
import ModelsContextReducer from './ModelsContextReducer';

export interface ModelsContextAttributes {
  models?: IModelFactory;
  setModels?: (models: IModelFactory) => void;
}

const initialState: ModelsContextAttributes = {
  models: {},
};

export const ModelsContext = createContext<ModelsContextAttributes>(initialState);

export const GlobalModelsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ModelsContextReducer, initialState);

  const setModels = (models: IModelFactory) => {
    dispatch({
      type: 'SET_MODELS',
      payload: { models },
    })
  }

  return (
    <ModelsContext.Provider value={{ ...state, setModels }}>
      {children}
    </ModelsContext.Provider>
  )
}