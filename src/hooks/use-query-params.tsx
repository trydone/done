'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'

export default function useQueryParams<T>() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSearchParams = new URLSearchParams(searchParams?.toString())

  function updateQueryParams(params: Partial<T>, push?: boolean) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        urlSearchParams.delete(key)
      } else {
        urlSearchParams.set(key, String(value))
      }
    })

    const search = urlSearchParams.toString()
    const query = search ? `?${search}` : ''
    // replace since we don't want to build a history

    if (push) {
      router.push(`${pathname}${query}`)
    } else {
      router.replace(`${pathname}${query}`)
    }
  }

  function replaceQueryParams(record: Record<string, string>) {
    const search = new URLSearchParams(record).toString()
    const query = search ? `?${search}` : ''
    // replace since we don't want to build a history
    router.replace(`${pathname}${query}`)
  }

  function getParamsAsRecord(opts?: {
    exclude?: string[]
  }): Record<string, string> {
    const object: Record<string, string> = {}
    for (const [key, value] of urlSearchParams.entries()) {
      if (opts?.exclude?.includes(key)) {
        continue
      }
      object[key] = value
    }
    return object
  }

  return {
    queryParams: searchParams,
    replaceQueryParams,
    updateQueryParams,
    getParamsAsRecord,
  }
}
