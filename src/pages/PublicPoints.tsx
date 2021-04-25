import { FC, ReactElement, useContext, useCallback, useState, useRef, useEffect } from 'react'
import { Toast } from 'primereact/toast'
import axios from 'axios'
// import {  } from 'mapbox-gl'
import { MapInstance } from '../contexts/MapInstanceContext'
import { ModelsContext } from '../contexts/ModelsContext';
import { Point, Type } from '../types/Types'
import { svgColor } from '../modules/SVGColorizer';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

export const PublicPoints: FC = (): ReactElement => {
  const { map } = useContext(MapInstance);
  const { models } = useContext(ModelsContext);
  const [points, setPoints] = useState<{ rows: Point[], count: number }>({ rows: [], count: 0 });
  const [types, setTypes] = useState<Type[]>([]);
  const [imageLoaded, toggleImageLoaded] = useState<boolean>(false);
  const { Point, Type } = models!;
  const toast = useRef<Toast>(null);

  const getPoints = useCallback(() => {
    Point.collection({
      attributes: ['name', 'longitude', 'latitude', 'description'],
      include: [
        { model: 'Type', attributes: ['name', 'color', 'icon'] }
      ]
    }).then(resp => {
      setPoints({ rows: resp.rows as Point[], count: resp.count });
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    })
  }, [Point]);

  const getTypes = useCallback(() => {
    Type.collection({
      attributes: ['name', 'icon', 'color', 'id']
    }).then(resp => {
      setTypes(resp.rows as Type[]);
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    })
  }, [Type])

  useEffect(() => {
    getPoints();
    getTypes();
  }, [getPoints, getTypes]);


  useEffect(() => {
    if (types.length > 0 && points.rows.length > 0 && typeof map !== 'undefined') {
      // console.log({ types, points, map })
      types.forEach((type: Type, i: number) => {
        axios.get(`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/icon/${type.id}`).then(resp => {
          // // @ts-ignore
          const image = new Image();
          const colorizedSVG = svgColor(`data:image/svg+xml;base64,${resp.data.data}`, type.color);
          if (colorizedSVG) {
            image.src = `${colorizedSVG}`;
            image.onload = () => {
              map.addImage(`icon-image${type.id}`, image);
              if (types.length === (i + 1)) {
                toggleImageLoaded(true);
              }
            }
            image.onerror = (e) => console.log(e)
          }
        }).catch(e => {
          toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString(), life: 3000 });
        })
        // map?.loadImage(`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/icon/${type.id}`, (error, image) => {
        //   if (error) throw error;
        //   // console.log({ image });
        //   if (!error) {
        //     // @ts-ignore
        //     map.addImage(`icon-image${type.id}`, { data: image as HTMLImageElement, height: 30, width: 30 });
        //   }
        // })
      });
    }
  }, [types, points, map]);

  useEffect(() => {
    if (typeof map !== 'undefined' && imageLoaded && points.rows.length > 0) {
      const currentSource = map.getSource('points');
      const currentLayer = map.getLayer('points');
      if (typeof currentLayer === 'undefined' && typeof currentSource === 'undefined') {
        map.addSource('points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: points.rows.map((point: Point) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [point.longitude, point.latitude],
              },
              properties: {
                title: point.name,
                icon: `icon-image${point.id}`
              }
            }))
          }
        });

        map.addLayer({
          'id': 'points',
          type: 'symbol',
          source: 'points',
          layout: {
            'icon-image': ['get','icon'],
            'icon-size': 0.30
            // 'text-field': ['get', 'title'],
            // 'text-offset': [0, 1.25],
            // 'text-anchor': 'bottom',
            // 'text-font': ['Arial']
          }
        });
      }
    }
  }, [map, imageLoaded, points])

  // useEffect(() => {
  //   if (points.rows.length > 0 && types.length > 0) {
  //   }
  // }, [points, types])

  return (
    <div>
      <Toast ref={toast} />
    </div>
  )
}
