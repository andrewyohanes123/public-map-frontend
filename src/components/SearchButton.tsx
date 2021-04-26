import { FC, ReactElement, useContext, useState, useEffect, useCallback } from 'react'
import { Type } from '../types/Types'
import { ModelsContext } from '../contexts/ModelsContext';

export const SearchButton: FC = (): ReactElement => {
  const [types, setTypes] = useState<Type[]>([]);
  const { models } = useContext(ModelsContext);
  const {Type} = models!;

  const getTypes = useCallback(() => {
    Type.collection({
      attributes: ['name', 'icon', 'color']
    }).then(resp => {
      setTypes(resp.rows as Type[]);
    }).catch(e => {
      console.log(e);
    })
  }, [Type]);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  return (
    <div className="search-container">
      <div className="search-toolbar p-shadow-3">
        <div className="search-input-box">
          <input className="search-input" type="text" placeholder="Cari Lokasi" />
        </div>
      </div>
      <div className="search-toolbar p-mt-3 p-shadow-3">
        {/* <div className="p-grid">         */}
        {types.map(type => (
          <div key={type.id} className="p-p-3 p-pl-3">{type.name}</div>
        ))}
        {/* </div> */}
      </div>
    </div>
  )
}
