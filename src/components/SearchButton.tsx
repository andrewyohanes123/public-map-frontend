import { FC, ReactElement, useContext, useState, useEffect, useCallback } from 'react'
import { bbox, lineString } from '@turf/turf'
import { District, Point } from '../types/Types'
import { ModelsContext } from '../contexts/ModelsContext';
import { Button } from 'primereact/button';
import { PointSidebar } from './PointSidebar';
import { SelectedPoint } from '../App';
import { PointsByType } from './PointsByType';
import { SearchPoint } from './SearchPoint';
import { MapInstance } from '../contexts/MapInstanceContext';

export const SearchButton: FC = (): ReactElement => {
  const [types, setTypes] = useState<District[]>([]);
  const [showType, toggleShowType] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<District | undefined>(undefined);
  const [query, setQuery] = useState<string>('');
  const { map } = useContext(MapInstance)
  const { models } = useContext(ModelsContext);
  const { sidebar } = useContext(SelectedPoint);
  const { District } = models!;

  const getTypes = useCallback(() => {
    District.collection({
      attributes: ['name'],
      include: [{
        model: 'Point',
        attributes: ['latitude', 'longitude']
      }]
    }).then(resp => {
      setTypes(resp.rows as District[]);
    }).catch(e => {
      alert(e.toString());
    })
  }, [District]);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  useEffect(() => {
    if (typeof selectedType !== 'undefined' && typeof map !== 'undefined') {
      const coordinates: [number, number][] = selectedType.points.map((point: Point) => ([point.longitude, point.latitude]));
      if (coordinates.length > 1) {
        const line = lineString(coordinates);
        const boundingBox = bbox(line);
        // @ts-ignore
        map.fitBounds(boundingBox, { padding: 100, zoom: 12.5 });
      } else if (coordinates.length === 1) {
        map.flyTo({
          // @ts-ignore
          center: coordinates[0],
        })
      }
    }
  }, [selectedType, map]);

  useEffect(() => {
    toggleShowType(!sidebar && typeof selectedType === 'undefined');
  }, [sidebar, selectedType]);

  useEffect(() => {
    (query.length > 0) && toggleShowType(false)
  }, [query]);

  return (
    <div className="search-container">
      <div className="search-toolbar p-shadow-3">
        <div className="search-input-box">
          <input value={query} onChange={ev => setQuery(ev.target.value)} className="search-input" type="text" placeholder="Cari Lokasi" />
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
          <Button onClick={() => toggleShowType(show => !show)} icon={`pi pi-fw pi-chevron-${showType ? 'up' : 'down'}`} label={`${showType ? 'Sembunyikan' : typeof selectedType !== 'undefined' ? 'Pilih' : 'Tampilkan'} Daerah`} className="p-button-sm p-button-outlined p-button-rounded" />
        </div>
      </div>
      <PointSidebar />
      {(typeof selectedType !== 'undefined' && !sidebar) && <PointsByType district_id={selectedType.id} district={selectedType} onBack={() => {
        setSelectedType(undefined);
        toggleShowType(query.length === 0)
      }} />}
      {(query.length > 0 && !sidebar) && <SearchPoint query={query} onBack={() => {
        toggleShowType(true)
        setQuery(``)
      }} />}
    </div>
  )
}
