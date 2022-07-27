import {
  FC,
  ReactElement,
  useState,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from "react";
import { Button } from "primereact/button";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { area, bbox, polygon } from "@turf/turf";
import { FormInput } from "../components/FormInput";
import { ModelsContext } from "../contexts/ModelsContext";
import { useHistory, useParams } from "react-router";
import { Point, Type, District } from "../types/Types";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { MapInstance } from "../contexts/MapInstanceContext";
import { UserContext } from "../contexts/UserContext";
import { GeoJsonProperties, Geometry, FeatureCollection } from "geojson";
import FeatureBox from "../components/FeatureBox";

const validationSchema = yup.object().shape({
  name: yup.string().required("Masukkan nama lokasi"),
  description: yup.string(),
  type_id: yup.number().required("Pilih tipe lokasii"),
  surface_area: yup.number().required("Masukkan luas daerah"),
});

type initVal = {
  name: string;
  type_id?: number;
  description: string;
  surface_area: number;
  district_id?: number;
};

const initialValues: initVal = {
  name: "",
  type_id: undefined,
  description: "",
  surface_area: 0,
};

export interface AddPointProps {
  // onSubmit: (val: typeof initialValues, cb: () => void) => void;
}

const draw = new MapboxDraw({
  displayControlsDefault: true,
  controls: {
    polygon: true,
    trash: true,
    point: false,
    line_string: false,
    combine_features: false,
    uncombine_features: false,
  },
  userProperties: true,
  defaultMode: "simple_select",
});

export const AddPoint: FC<AddPointProps> = (): ReactElement => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [point, setPoint] = useState<Point | undefined>(undefined);
  const [surfaceArea, setSurfaceArea] = useState<number>(0);
  const [types, setTypes] = useState<Type[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const { models } = useContext(ModelsContext);
  const { map } = useContext(MapInstance);
  const { user } = useContext(UserContext);
  const { Point, Type, District } = models!;
  const { push } = useHistory();
  const { id } = useParams<{ id: string }>();
  const [featureCollection, setFeatureCollection] = useState<
    FeatureCollection<Geometry, GeoJsonProperties>
  >({
    features: [],
    type: "FeatureCollection",
  });
  const toast = useRef<Toast>(null);

  document.title = "Dashboard - Tambah Point";

  const onFinish = useCallback(
    (
      val: typeof initialValues,
      formik: FormikHelpers<typeof initialValues>
    ) => {
      toggleLoading(true);
      Point.create({
        ...val,
        user_id: user?.id,
        pointType: "Feature",
        geometry: draw.getAll(),
        properties: {},
        surface_area: surfaceArea,
      })
        .then((resp) => {
          toast.current?.show({
            severity: "success",
            summary: "Lokasi Disimpan",
            detail: `Lokasi ${resp.name} berhasil disimpan`,
          });
          push(`/dashboard`);
        })
        .catch((e) => {
          toast.current?.show({
            severity: "error",
            summary: "Terjadi Kesalahan",
            detail: e.toString(),
          });
        });
    },
    [Point, user, push, surfaceArea]
  );

  const onUpdate = useCallback(
    (val: initVal, formik: FormikHelpers<typeof initialValues>) => {
      toggleLoading(true);
      if (typeof point !== "undefined") {
        point
          .update({
            ...val,
            geometry: draw.getAll(),
            surface_area: surfaceArea,
          })
          .then((resp) => {
            toast.current?.show({
              severity: "success",
              summary: "Lokasi Disimpan",
              detail: `Lokasi ${resp.name} berhasil disimpan`,
            });
            push(`/dashboard`);
          })
          .catch((e) => {
            toast.current?.show({
              severity: "error",
              summary: "Terjadi Kesalahan",
              detail: e.toString(),
            });
          });
      }
    },
    [point, push, surfaceArea]
  );

  const getPoint = useCallback(() => {
    if (typeof id !== "undefined") {
      Point.single(parseInt(id))
        .then((resp) => {
          setPoint(resp as Point);
          setSurfaceArea(resp.surface_area);
          console.log(resp);
        })
        .catch((e) => {
          console.log(e)
          toast.current?.show({
            severity: "error",
            summary: "Terjadi Kesalahan",
            detail: e.toString(),
          });
        });
    }
  }, [id, Point]);

  const getTypes = useCallback(() => {
    Type.collection({
      attributes: ["name", "icon", "color"],
    })
      .then((resp) => {
        setTypes(resp.rows as Type[]);
      })
      .catch((e) => {
        console.log(e)
        toast.current?.show({
          severity: "error",
          summary: "Terjadi Kesalahan",
          detail: e.toString(),
        });
      });
  }, [Type]);

  const getDistricts = useCallback(() => {
    District.collection({
      attributes: ["name"],
    })
      .then((resp) => {
        setDistricts(resp.rows as District[]);
      })
      .catch((e) => {
        alert(e.toString());
      });
  }, [District]);

  useEffect(() => {
    getTypes();
    getDistricts();
  }, [getTypes, getDistricts]);

  useEffect(() => {
    typeof id !== "undefined" && getPoint();
  }, [getPoint, id]);

  useEffect(() => {
    const data = featureCollection;
    data.features.forEach((feature, idx) => {
      const surface = area(feature);
      const calculatedArea =
        Math.round(Math.round(surface * 100) / 100) / 10000;
      const damagedAreaPercentage = (calculatedArea / surfaceArea) * 100;
      draw.setFeatureProperty(
        feature.id?.toString() || "",
        "damage_percentage",
        idx === 0 ? 0 : damagedAreaPercentage
      );
      // draw.add(data);
      const d = draw.getAll();
      draw.set(d)
      console.log(d);
    });
  }, [featureCollection, surfaceArea]);

  useEffect(() => {
    if (typeof map !== "undefined") {
      console.log(map);
      if (!map.hasControl(draw)) {
        map.addControl(draw, "top-left");
      }
      if (typeof point !== "undefined") {
        // @ts-ignore
        // const line_string = lineString(point.geometry.features[0].coordinates);
        const boundingBox = bbox(point.geometry);
        // @ts-ignore
        map?.fitBounds(boundingBox, {padding: 30});
        draw.add(point.geometry);
        // marker.setLngLat([point.longitude, point.latitude]).addTo(map)
      } else {
        map.flyTo({
          center: [map.getCenter().lng, map.getCenter().lat],
        });
      }

      map.on("draw.create", (e: any) => {
        // setCoords(e.features[0].geometry.coordinates);
        const data = draw.getAll();
        const firstLayerArea = polygon(
          data.features
            .filter((_data, index) => index === 0)
            // @ts-ignore
            .map((data) => data.geometry.coordinates)
            .flat()
        );
        const surface = data.features.length > 0 ? area(firstLayerArea) : 0;
        // updateProperties(data);
        setFeatureCollection(data);
        setSurfaceArea(Math.round(Math.round(surface * 100) / 100) / 10000);
      });

      map.on("draw.update", (e: any) => {
        const data = draw.getAll();
        const firstLayerArea = polygon(
          data.features
            .filter((_data, index) => index === 0)
            // @ts-ignore
            .map((data) => data.geometry.coordinates)
            .flat()
        );
        const surface = data.features.length > 0 ? area(firstLayerArea) : 0;
        setFeatureCollection(data);
        setSurfaceArea(Math.round(Math.round(surface * 100) / 100) / 10000);
      });

      map.on("draw.delete", (e: any) => {
        const data = draw.getAll();
        const firstLayerArea = polygon(
          data.features
            .filter((_data, index) => index === 0)
            // @ts-ignore
            .map((data) => data.geometry.coordinates)
            .flat()
        );
        const surface = data.features.length > 0 ? area(firstLayerArea) : 0;
        setFeatureCollection(data);
        setSurfaceArea(Math.round(Math.round(surface * 100) / 100) / 10000);
      });
    }
    return () => {
      if (typeof map !== "undefined") {
        if (map.hasControl(draw)) {
          map.removeControl(draw);
        }
      }
    };
  }, [map, point]);

  return (
    <div style={{ color: "white" }}>
      <Toast ref={toast} />
      <div
        className="p-p-3 p-d-flex"
        style={{ borderBottom: "1px solid var(--surface-700)" }}
      >
        <div className="p-mr-1">
          <Button
            onClick={() => {
              push("/dashboard/");
            }}
            className="p-button-sm"
            icon="pi pi-chevron-left"
          />
        </div>
        <div
          style={{ color: "white" }}
          className="p-mr-2 p-pl-2 p-pt-2 p-text-center"
        >
          {typeof id !== "undefined" ? (
            <p className="p-text-center">Edit Lokasi</p>
          ) : (
            <p className="p-text-center">Tambah Lokasi</p>
          )}
        </div>
      </div>
      <div className="p-p-3">
        {featureCollection.features.map((feature, idx) =>
          idx > 0 ? (
            <FeatureBox
              totalArea={surfaceArea}
              isFirst={idx === 0}
              name={"Area Kerusakan"}
              coordinates={feature.geometry}
              key={feature.id}
            />
          ) : (
            <></>
          )
        )}
        <Formik
          validationSchema={validationSchema}
          onSubmit={typeof point !== "undefined" ? onUpdate : onFinish}
          key={point?.id ?? 10}
          initialValues={
            typeof point !== "undefined"
              ? {
                  name: point.name!,
                  type_id: point.type_id,
                  description: point.description!,
                  surface_area: point.surface_area,
                  district_id: point.district_id,
                }
              : initialValues
          }
        >
          {({
            handleSubmit,
            touched,
            errors,
            values,
            handleBlur,
            handleChange,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <FormInput
                autoComplete="off"
                type="text"
                loading={loading}
                name="name"
                label="Nama Lokasi"
                touched={touched}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                values={values}
              />
              <div className="p-field p-d-block p-fluid">
                <label
                  className={`${
                    errors.surface_area && touched.surface_area
                      ? "p-error p-d-block"
                      : ""
                  }`}
                  htmlFor=""
                >
                  Luas Daerah
                </label>
                <p>{surfaceArea} Ha</p>
              </div>
              <div className="p-field p-d-block p-fluid">
                <label
                  className={`${
                    errors.district_id && touched.district_id
                      ? "p-error p-d-block"
                      : ""
                  }`}
                  htmlFor=""
                >
                  Kabupaten/Kota
                </label>
                <Dropdown
                  value={values.district_id}
                  onChange={handleChange}
                  id="select"
                  onBlur={handleBlur}
                  options={districts.map((district) => ({
                    value: district.id,
                    label: district.name,
                  }))}
                  name="district_id"
                  placeholder="Pilih Kabupaten/Kota"
                  className={`${
                    errors.district_id && touched.district_id ? "p-invalid" : ""
                  }`}
                  filter
                  filterBy="label"
                />
                {errors.district_id && touched.district_id && (
                  <small
                    className={`${
                      errors.district_id && touched.district_id
                        ? "p-error p-d-block"
                        : ""
                    }`}
                  >
                    {errors.district_id}
                  </small>
                )}
              </div>
              <div className="p-field p-d-block p-fluid">
                <label
                  className={`${
                    errors.type_id && touched.type_id ? "p-error p-d-block" : ""
                  }`}
                  htmlFor=""
                >
                  Tipe
                </label>
                <Dropdown
                  value={values.type_id}
                  onChange={handleChange}
                  id="select"
                  onBlur={handleBlur}
                  options={types.map((type) => ({
                    value: type.id,
                    label: type.name,
                  }))}
                  name="type_id"
                  placeholder="Pilih Tipe Lokasi"
                  className={`${
                    errors.type_id && touched.type_id ? "p-invalid" : ""
                  }`}
                  filter
                  filterBy="label"
                />
                {errors.type_id && touched.type_id && (
                  <small
                    className={`${
                      errors.type_id && touched.type_id
                        ? "p-error p-d-block"
                        : ""
                    }`}
                  >
                    {errors.type_id}
                  </small>
                )}
              </div>
              <div className="p-field p-d-block p-fluid">
                <label
                  className={`${
                    errors.type_id && touched.type_id ? "p-error p-d-block" : ""
                  }`}
                  htmlFor="description"
                >
                  Deskripsi
                </label>
                <InputTextarea
                  value={values.description}
                  onChange={handleChange}
                  id="description"
                  onBlur={handleBlur}
                  style={{ resize: "vertical" }}
                  rows={8}
                  name="description"
                  placeholder="Deskripsi Lokasi"
                  className={`${
                    errors.type_id && touched.type_id ? "p-invalid" : ""
                  }`}
                />
                {errors.type_id && touched.type_id && (
                  <small
                    className={`${
                      errors.type_id && touched.type_id
                        ? "p-error p-d-block"
                        : ""
                    }`}
                  >
                    {errors.type_id}
                  </small>
                )}
              </div>
              <div className="p-field p-fluid p-d-block">
                <Button
                  label={typeof id !== "undefined" ? "Simpan" : "Tambah"}
                  icon={`pi pi-fw ${
                    typeof id !== "undefined" ? `pi-save` : "pi-plus"
                  }`}
                  className="p-button-success p-button-sm p-fluid"
                />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
