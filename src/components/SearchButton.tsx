import { FC, ReactElement, useContext, useState, useEffect, useCallback } from 'react'
import { Type } from '../types/Types'
import { ModelsContext } from '../contexts/ModelsContext';
import { Button } from 'primereact/button';
import { PointSidebar } from './PointSidebar';
import { SelectedPoint } from '../App';
import { PointsByType } from './PointsByType';

export const SearchButton: FC = (): ReactElement => {
  const [types, setTypes] = useState<Type[]>([]);
  const [showType, toggleShowType] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<Type | undefined>(undefined);
  const { models } = useContext(ModelsContext);
  const { sidebar } = useContext(SelectedPoint);
  const { Type } = models!;

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

  useEffect(() => {
    toggleShowType(!sidebar && typeof selectedType === 'undefined');
  }, [sidebar, selectedType]);

  return (
    <div className="search-container">
      <div className="search-toolbar p-shadow-3">
        <div className="search-input-box">
          <input className="search-input" type="text" placeholder="Cari Lokasi" />
        </div>
      </div>
      <div className={`search-toolbar ${showType ? 'p-mt-3' : 'p-mt-2'} p-p-3 p-shadow-3`}>
        {/* <div className="p-grid">         */}
        {(typeof selectedType !== 'undefined' && !showType) ?
          <p className="p-mt-1 p-mb-3">{selectedType.name}</p>
          :
          <></>
        }
        {showType &&
          types.map(type => (
            <div key={type.id} onClick={() => {
              setSelectedType(type);
              toggleShowType(false);
            }} className="p-p-2 p-mt-1 p-mb-1 p-pl-3 category-options">{type.name}</div>
          ))}
        {/* </div> */}
        <div className={`p-d-flex p-flex-column p-jc-center p-ai-center ${showType ? 'p-mt-2' : ''}`}>
          <Button onClick={() => toggleShowType(show => !show)} icon={`pi pi-fw pi-chevron-${showType ? 'up' : 'down'}`} label={`${showType ? 'Sembunyikan' : typeof selectedType !== 'undefined' ? 'Pilih' : 'Tampilkan'} Kategori`} className="p-button-sm p-button-outlined p-button-rounded" />
        </div>
      </div>
      <PointSidebar />
      {(typeof selectedType !== 'undefined' && !sidebar) && <PointsByType type_id={selectedType.id} type={selectedType} onBack={() => {
        setSelectedType(undefined);
        toggleShowType(true)
        }} />}
    </div>
  )
}
