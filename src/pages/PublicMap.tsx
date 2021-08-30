import { FC, ReactElement } from 'react'
import { SearchButton } from '../components/SearchButton'
import { UserBadge } from '../components/UserBadge'
import { MainPage } from './MainPage'
import { PublicPoints } from './PublicPoints'

export const PublicMap: FC = (): ReactElement => {
  return (
    <>
      <MainPage />
      <SearchButton />
      <PublicPoints />
      <UserBadge />
    </>
  )
}
