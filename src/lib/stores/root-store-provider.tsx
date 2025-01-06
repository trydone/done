'use client'

import {PropsWithChildren} from 'react'

import {rootStore, RootStoreContext} from './root-store'

export const RootStoreProvider = ({children}: PropsWithChildren) => {
  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  )
}
