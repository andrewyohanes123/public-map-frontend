import { FC, ReactElement } from 'react'

export interface SidebarCoverImageProps {
  src: string;
}

export const SidebarCoverImage: FC<SidebarCoverImageProps> = ({ src }): ReactElement => {
  return (
    <div className="p-mt-2" style={{ borderRadius: 8, overflow: 'hidden', padding: 0 }}>
      <img alt="cover" src={src} style={{ width: '100%', height: 'auto', margin: 0 }} />
    </div>
  )
}
