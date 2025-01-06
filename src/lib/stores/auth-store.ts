import { deleteCookie, getCookie } from 'cookies-next'
import { decodeJwt } from 'jose'
import { makeAutoObservable, runInAction } from 'mobx'

import { RootStore } from './root-store'

export class AuthStore {
  rootStore: RootStore
  loginState: undefined | { decoded: any } // Update type based on your needs
  isLoading: boolean = true

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.loginState = undefined
    makeAutoObservable(this, undefined, { autoBind: true })

    // Check auth state on initialization
    if (typeof window !== 'undefined') {
      this.checkAuth()
    }
  }

  async checkAuth() {
    try {
      this.isLoading = true
      const jwt = getCookie('jwt')

      if (!jwt) {
        this.loginState = undefined
        return
      }

      const decoded = decodeJwt(jwt as string)

      if (!decoded || !decoded.sub) {
        this.logout()
        return
      }

      // Set user from JWT payload
      runInAction(() => {
        this.loginState = {
          decoded: decoded as any,
        }
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Auth check failed:', error)
      this.logout()
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  setLoginState(state: typeof this.loginState) {
    this.loginState = state
  }

  logout() {
    deleteCookie('jwt')
    this.setLoginState(undefined)
  }
}
