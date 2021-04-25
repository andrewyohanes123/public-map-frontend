import axios from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card'
import { FC, ReactElement, useCallback, useEffect, useState, useMemo } from 'react'
import { svgColor } from '../modules/SVGColorizer';
import { Type } from '../types/Types'

export interface TypeCardProps {
  type: Type;
  onEdit: (type: Type) => void;
}

const { REACT_APP_IP_ADDRESS, REACT_APP_PORT }: NodeJS.ProcessEnv = process.env;

export const TypeCard: FC<TypeCardProps> = ({ type, onEdit }): ReactElement => {
  const [img, setImg] = useState<string>('');
  const [loading, toggleLoading] = useState<boolean>(true);

  const getImage = useCallback(() => {
    toggleLoading(true);
    axios.get(`${REACT_APP_IP_ADDRESS}:${REACT_APP_PORT}/icon/${type.id}`).then(resp => {
      toggleLoading(false);
      setImg(resp.data.data);
    }).catch(e => console.log(e));
  }, [type]);

  useEffect(() => {
    getImage();
  }, [getImage]);

  const loadingDisplay = useMemo(() => (
    <div className="p-p-2 p-text-center">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: 30 }}></i>
      <p className="p-mt-3">Loading Icon</p>
    </div>
  ), []);

  const imgDisplay = useMemo(() => (
    <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
      <img alt={type.name} draggable={false} style={{ width: 200, height: 200 }} src={svgColor(`data:image/svg+xml;base64,${img}`, type.color)} />
    </div>
  ), [type, img])

  return (
    <div className="p-col-3">
      <Card
        title={<h4 className="p-text-normal">{type.name}</h4>}
        subTitle={type.color}
        header={loading ? loadingDisplay : imgDisplay}
        className="p-shadow-3"
      >
        <Button icon="pi pi-pencil" onClick={() => onEdit(type)} className="p-mr-2 p-button-warning" />
        <Button icon="pi pi-trash" className="p-button-danger" />
      </Card>
    </div>
  )
}
