'use client'

import {PropsWithChildren} from 'react'

import {useZero} from '@/hooks/use-zero'

import {rootStore, RootStoreContext} from './root-store'

export const RootStoreProvider = ({children}: PropsWithChildren) => {
  const zero = useZero()
  rootStore.initializeZero(zero)

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  )
}
