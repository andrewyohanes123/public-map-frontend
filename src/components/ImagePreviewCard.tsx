import { Button } from 'primereact/button';
import { FC, ReactElement, useMemo } from 'react'

export interface ImagePreviewCardProps {
  src: string;
  onRemove: () => void;
}

export const ImagePreviewCard: FC<ImagePreviewCardProps> = ({ src, onRemove }): ReactElement => {
  const alt = useMemo(() => Math.random() * 1000000, []);
  return (
    <div className="p-shadow-3 p-mt-2 p-mb-1" style={{ background: 'var(--surface-b)', borderRadius: 8, overflow: 'hidden' }}>
      <img src={src} alt={`selected${alt}`} style={{ width: '100%' }} />
      <div className="p-p-2 p-d-flex p-jc-center p-ai-center">
        <Button onClick={onRemove} icon="pi pi-fw pi-times" className="p-button-sm p-button-rounded p-button-danger p-button-outlined" />
      </div>
    </div>
  )
}
