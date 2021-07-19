import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'
import { FC, ReactElement, useContext, useRef, useEffect, useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router';
import { MapInstance } from '../contexts/MapInstanceContext';
import { ModelsContext } from '../contexts/ModelsContext';
import { Picture, Point } from '../types/Types';
import Dropzone from 'react-dropzone'
import { UserPoints } from '../components/UserPoints';
import { ImagePreviewCard } from '../components/ImagePreviewCard';

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;
export const PointDetail: FC = (): ReactElement => {
  const [point, setPoint] = useState<Point | undefined>(undefined);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [selectedPictures, setSelectedPictures] = useState<string[]>([]);
  const [uploading, toggleUploading] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const { models } = useContext(ModelsContext);
  const { map } = useContext(MapInstance);
  const { Point: PointSingle, Picture } = models!;
  const { id } = useParams<{ id: string }>();
  const {push} = useHistory();

  document.title = typeof point !== 'undefined' ? `Dashboard - ${point.name}` : 'Public Map'

  const getPoint = useCallback(() => {
    if (map) {
      PointSingle.single(parseInt(id)).then(resp => {
        setPoint(resp as Point);
        map.flyTo({
          center: [resp.longitude, resp.latitude],
          zoom: 14
        })
      }).catch(e => {
        toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
      });
    }
  }, [PointSingle, id, map]);

  const getPictures = useCallback(() => {
    Picture.collection({
      attributes: ['file', 'description', 'point_id'],
      where: {
        point_id: id
      }
    }).then(resp => {
      setPictures(resp.rows as Picture[]);
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    });
  }, [Picture, id]);

  const selectPictures = useCallback((files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setSelectedPictures(pic => [...pic, reader.result as string]);
      }
    })
  }, []);

  const removePicture = useCallback((b64: string) => {
    setSelectedPictures(pics => [...pics.filter(pic => pic !== b64)]);
  }, []);

  const uploadPictures = useCallback(() => {
    toggleUploading(true);
    selectedPictures.forEach(async (pic, i) => {
      try {
        await Picture.create({ file: pic, point_id: id });
        toast.current?.show({ severity: 'success', summary: 'Upload Berhasil', detail: `Gambar berhasil diupload` });
        if (selectedPictures.length === (i + 1)) {
          toggleUploading(false);
          getPictures();
          setSelectedPictures([]);
        }
      } catch (e) {
        toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
      }
    });
  }, [selectedPictures, Picture, id, getPictures]);
  
  const deletePicture = useCallback((pic: Picture) => {
    pic.delete().then(resp => {
      console.log(resp);
      getPictures();
    }).catch(e => {
      toast.current?.show({ severity: 'error', summary: 'Terjadi Kesalahan', detail: e.toString() });
    })
  }, [getPictures]);

  useEffect(() => {
    getPoint();
    getPictures();
  }, [getPoint, getPictures]);

  return (
    typeof point !== 'undefined' ?
      <div style={{ color: 'var(--surface-900)', overflow: 'auto', height: '100%' }}>
        <Toast ref={toast} />
        <div className="p-p-3" style={{ background: point.type.color }}>
          <Button onClick={() => push('/dashboard')} icon="pi pi-fw pi-chevron-left" />
        </div>
        <div className="p-p-3">
          <h2 style={{ color: 'var(--text-color)' }} className="p-text-normal">{point.name}</h2>
          <p style={{ color: 'var(--text-color-secondary)' }} className="p-mb-4">{point.type.name}</p>
          <p style={{ color: 'var(--text-color)' }}>{point.description}</p>
        </div>
        <Dropzone multiple onDropAccepted={selectPictures} accept={['image/png', 'image/jpeg', 'image/jpg']}>
          {({ getInputProps, getRootProps }) => (
            (selectedPictures.length > 0) ?
              <div {...getRootProps({ style: { height: 90, background: 'var(--surface-600)', borderRadius: 8, cursor: 'pointer' }, className: 'p-m-3 p-p-3 p-text-center p-d-flex p-flex-column p-jc-center p-ai-center' })}>
                <input {...getInputProps()} />
                <h3 style={{ color: 'var(--text-color)' }}>{selectedPictures.length} gambar terpilih</h3>
                <p style={{ color: 'var(--text-color-secondary)' }}>Klik kotak ini untuk menambah gambar lokasi</p>
              </div>
              :
              pictures.length > 0 ?
                <div {...getRootProps({ style: { background: 'var(--surface-600)', borderRadius: 8, cursor: 'pointer' }, className: 'p-m-3 p-p-3 p-text-center p-d-flex p-flex-column p-jc-center p-ai-center' })}>
                  <input {...getInputProps()} />
                  <div style={{ background: 'var(--surface-900)', padding: '15px 10px', borderRadius: '60%', marginBottom: 5 }}>
                    <i className="pi pi-fw pi-plus" style={{ fontSize: 30, color: 'var(--text-color)' }}></i>
                  </div>
                  <h3 style={{ color: 'var(--text-color)' }}>Total {pictures.length} gambar</h3>
                  <p style={{ color: 'var(--text-color-secondary)' }}>Klik kotak ini untuk menambah gambar lokasi</p>
                </div>
                :
                <div {...getRootProps({ style: { height: 350, background: 'var(--surface-600)', borderRadius: 8, cursor: 'pointer' }, className: 'p-m-3 p-p-3 p-text-center p-d-flex p-flex-column p-jc-center p-ai-center' })}>
                  <input {...getInputProps()} />
                  <div style={{ background: 'var(--surface-900)', padding: '15px 10px', borderRadius: '60%', marginBottom: 5 }}>
                    <i className="pi pi-fw pi-image" style={{ fontSize: 50, color: 'var(--text-color)' }}></i>
                  </div>
                  <h3 style={{ color: 'var(--text-color)' }}>Belum ada gambar</h3>
                  <p style={{ color: 'var(--text-color-secondary)' }}>Klik kotak ini untuk menambah gambar lokasi</p>
                </div>
          )}
        </Dropzone>
        <div className="p-p-3">
          {
            pictures.map(pic => (
              <ImagePreviewCard key={pic.id} src={`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/picture/${pic.id}`} onRemove={() => deletePicture(pic)} />
            ))
          }
        </div>
        <div className="p-p-3 p-d-block p-fluid">
          {selectedPictures.length > 0 && <Button
            disabled={uploading}
            label={uploading ? "Mengupload gambar" : "Upload Semua"}
            className="p-d-block p-fluid"
            icon={uploading ? "pi pi-spin pi-spinner" : "pi pi-upload"}
            onClick={uploadPictures}
          />}
          {
            selectedPictures.map((pic, i) => (
              <ImagePreviewCard src={pic} key={i} onRemove={() => removePicture(pic)} />
            ))
          }
        </div>
        <UserPoints />
      </div>
      :
      <>
      </>
  )
}
