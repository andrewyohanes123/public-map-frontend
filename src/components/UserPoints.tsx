import { FC, ReactElement, useContext, useCallback, useState, useRef, useEffect } from 'react'
import { Toast } from 'primereact/toast'
// import axios from 'axios'
// import {  } from 'mapbox-gl'
import { MapInstance } from '../contexts/MapInstanceContext'
import { ModelsContext } from '../contexts/ModelsContext';
import { Point } from '../types/Types'
// import { svgColor } from '../modules/SVGColorizer';
import { UserContext } from '../contexts/UserContext';

// const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

export const UserPoints: FC = (): ReactElement => {
  const { map } = useContext(MapInstance);
  const { models } = useContext(ModelsContext);
  const { user } = useContext(UserContext);
  const [points, setPoints] = useState<{ rows: Point[], count: number }>({ rows: [], count: 0 });
  // const [types, setTypes] = useState<Type[]>([]);
  // const [imageLoaded, toggleImageLoaded] = useState<boolean>(false);
  const { Point } = models!;
  const toast = useRef<Toast>(null);

  const getPoints = useCallback(() => {
    Point.collection({
      attributes: ['name', 'pointType', 'properties', 'geometry', 'description', 'type_id'],
      include: [
        { model: 'Type', attributes: ['name', 'color', 'icon'] }
      ],
      where: {
        user_id: user?.id
      }
    }).then(resp => {
      setPoints({ rows: resp.rows as Point[], count: resp.count });
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    })
  }, [Point, user]);


  useEffect(() => {
    getPoints();
  }, [getPoints]);


  // useEffect(() => {
  //   if (types.length > 0 && points.rows.length > 0 && typeof map !== 'undefined') {
  //     // console.log({ types, points, map })
  //     types.forEach((type: Type, i: number) => {
  //       axios.get(`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/icon/${type.id}`).then(resp => {
  //         // // @ts-ignore
  //         const image = new Image();
  //         const colorizedSVG = svgColor(`data:image/svg+xml;base64,${resp.data.data}`, type.color);
  //         if (colorizedSVG) {
  //           image.src = `${colorizedSVG}`;
  //           image.onload = () => {
  //             map.addImage(`icon-image${type.id}`, image);
  //             if (types.length === (i + 1)) {
  //               toggleImageLoaded(true);
  //             }
  //           }
  //           image.onerror = (e) => console.log(e)
  //         }
  //       }).catch(e => {
  //         toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString(), life: 3000 });
  //       })
  //       // map?.loadImage(`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/icon/${type.id}`, (error, image) => {
  //       //   if (error) throw error;
  //       //   // console.log({ image });
  //       //   if (!error) {
  //       //     // @ts-ignore
  //       //     map.addImage(`icon-image${type.id}`, { data: image as HTMLImageElement, height: 30, width: 30 });
  //       //   }
  //       // })
  //     });
  //   }
  // }, [types, points, map]);

  useEffect(() => {
    if (typeof map !== 'undefined' && points.rows.length > 0) {
      const currentSource = map.getSource('points');
      const currentLayer = map.getLayer('points');
      (typeof currentLayer !== 'undefined') && map.removeLayer('points');
      (typeof currentSource !== 'undefined') && map.removeSource('points');

      map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: points.rows.map((point: Point) => ({
            type: point.pointType,
            geometry: point.geometry,
            properties: {
              title: point.name,
              // icon: `icon-image${point.type_id}`
            }
          }))
        }
      });

      map.addLayer({
        'id': 'points',
        type: 'fill',
        source: 'points',
        layout: {
        },
        paint: {
          'fill-color': 'rgba(0, 184, 148, 0.6)',
          'fill-outline-color': 'rgba(0, 184, 148, 0.5)'
        }
      });

    }
    return () => {
      // if (typeof map !== 'undefined') {
      //   map.removeLayer("points");
      //   map.removeSource("points");
      // }
    }
  }, [map, points])

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
