'use client'
import {createContext} from 'react'

import {useZero} from '@/hooks/use-zero'

import {AuthStore} from './auth-store'
import {LocalStore} from './local-store'

export class RootStore {
  private static instance: RootStore | null = null

  localStore!: LocalStore
  authStore!: AuthStore
  zero: ReturnType<typeof useZero> | null = null

  public static getInstance(): RootStore {
    if (!RootStore.instance) {
      RootStore.instance = new RootStore()
    }
    return RootStore.instance
  }

  public initializeZero(zero: ReturnType<typeof useZero>) {
    if (!this.zero) {
      this.zero = zero
      this.localStore = new LocalStore(this, zero)
      this.authStore = new AuthStore(this)
    }
  }

  private constructor() {
    if (RootStore.instance) {
      return RootStore.instance
    }
  }
}
const rootStoreInstance = RootStore.getInstance()

export const rootStore = rootStoreInstance
export const RootStoreContext = createContext<RootStore>(rootStoreInstance)
