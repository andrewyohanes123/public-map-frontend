import {
  FC,
  ReactElement,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import { Toast } from "primereact/toast";
import axios from "axios";
// import {  } from 'mapbox-gl'
import { MapInstance } from "../contexts/MapInstanceContext";
import { ModelsContext } from "../contexts/ModelsContext";
import { Point, Type } from "../types/Types";
import { svgColor } from "../modules/SVGColorizer";
import { SelectedPoint } from "../App";

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

export const PublicPoints: FC = (): ReactElement => {
  const { map } = useContext(MapInstance);
  const { models } = useContext(ModelsContext);
  const { setPointId, toggleSidebar } = useContext(SelectedPoint);
  const [points, setPoints] = useState<{ rows: Point[]; count: number }>({
    rows: [],
    count: 0,
  });
  const [types, setTypes] = useState<Type[]>([]);
  const [imageLoaded, toggleImageLoaded] = useState<boolean>(false);
  const { Point, Type } = models!;
  const toast = useRef<Toast>(null);

  const getPoints = useCallback(() => {
    Point.collection({
      attributes: [
        "name",
        "pointType",
        "properties",
        "geometry",
        "description",
        "type_id",
      ],
      include: [{ model: "Type", attributes: ["name", "color", "icon"] }],
    })
      .then((resp) => {
        setPoints({ rows: resp.rows as Point[], count: resp.count });
      })
      .catch((e) => {
        toast.current?.show({
          severity: "error",
          summary: "Terjadi Kesalahan",
          detail: e.toString(),
        });
      });
  }, [Point]);

  const getTypes = useCallback(() => {
    Type.collection({
      attributes: ["name", "icon", "color", "id"],
    })
      .then((resp) => {
        setTypes(resp.rows as Type[]);
      })
      .catch((e) => {
        toast.current?.show({
          severity: "error",
          summary: "Terjadi Kesalahan",
          detail: e.toString(),
        });
      });
  }, [Type]);

  useEffect(() => {
    getPoints();
    getTypes();
  }, [getPoints, getTypes]);

  useEffect(() => {
    if (
      types.length > 0 &&
      points.rows.length > 0 &&
      typeof map !== "undefined"
    ) {
      // console.log({ types, points, map })
      types.forEach((type: Type, i: number) => {
        // const currentImage = map.
        axios
          .get(`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/icon/${type.id}`)
          .then((resp) => {
            // // @ts-ignore
            const image = new Image();
            const colorizedSVG = svgColor(
              `data:image/svg+xml;base64,${resp.data.data}`,
              type.color
            );
            if (colorizedSVG) {
              image.src = `${colorizedSVG}`;
              image.onload = () => {
                map.addImage(`icon-image${type.id}`, image);
                if (types.length === i + 1) {
                  toggleImageLoaded(true);
                }
              };
              image.onerror = (e) => console.log(e);
            }
          })
          .catch((e) => {
            toast.current?.show({
              severity: "error",
              summary: "Terjadi Kesalahan",
              detail: e.toString(),
              life: 3000,
            });
          });
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

  // useEffect(() => {
  //   if (typeof map !== 'undefined') {
  //     axios.get(`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/map/base`).then(resp => {
  //       map.addSource('tc-land', {
  //         type: 'geojson',
  //         data: resp.data
  //       });
  //       map.addLayer({
  //         id: 'tc-land',
  //         source: 'tc-land',
  //         // 'source-layer': 'land',
  //         type: 'fill',
  //         paint: {
  //           'fill-color': '#ffffff',
  //         }
  //       })
  //     })
  //   }
  // }, [map])

  useEffect(() => {
    if (typeof map !== "undefined" && imageLoaded && points.rows.length > 0) {
      const currentSource = map.getSource("points");
      const currentLayer = map.getLayer("points");

      if (
        typeof currentLayer === "undefined" &&
        typeof currentSource === "undefined"
      ) {
        const sourcePoints = points.rows.map((point) =>
          point.geometry.features.map((feature) => ({
            ...feature,
            properties: { ...feature.properties, id: point.id },
          }))
        );
        map.addSource("points", {
          type: "geojson",
          // @ts-ignore
          data: {
            type: "FeatureCollection",
            features: sourcePoints.flat(),
          },
        });

        map.addLayer({
          id: "points",
          type: "fill",
          source: "points",
          layout: {
            "fill-sort-key": ["number", ["get", "damage_percentage"]],
          },
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["number", ["get", "damage_percentage"]],
              0,
              ["rgba", 29, 209, 161, 0.25],
              50,
              ["rgba", 249, 202, 36, 0.25],
              100,
              ["rgba", 235, 77, 75, 0.25],
            ],
            // ["rgba", ["get", "damage_percentage"], 0, ["-", 100, ["get", "damage_percentage"]]],
            "fill-outline-color": [
              "interpolate",
              ["linear"],
              ["number", ["get", "damage_percentage"]],
              0,
              ["rgba", 29, 209, 161, 0.35],
              50,
              ["rgba", 249, 202, 36, 0.35],
              100,
              ["rgba", 235, 77, 75, 0.35],
            ],
          },
        });

        map.on("mouseenter", "points", (e) => {
          console.log(e.features);
          map.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        map.on("mouseleave", "points", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "points", (e) => {
          // @ts-ignore
          setPointId(e.features![0].properties.id);
          console.log({e})
          map.flyTo({
            center: e.lngLat,
            zoom: 12
          });
          toggleSidebar(true);
        });
      }
    }
    return () => {
      // if (typeof map !== 'undefined') {
      //   const currentSource = map.getSource('points');
      //   const currentLayer = map.getLayer('points');
      //   if (typeof currentSource !== 'undefined' && typeof currentLayer !== 'undefined') {
      //     map.removeLayer("points");
      //     map.removeSource("points");
      //   }
      // }
    };
  }, [map, imageLoaded, points, setPointId, toggleSidebar]);

  // useEffect(() => {
  //   if (points.rows.length > 0 && types.length > 0) {
  //   }
  // }, [points, types])

  return (
    <div>
      <Toast ref={toast} />
    </div>
  );
};
