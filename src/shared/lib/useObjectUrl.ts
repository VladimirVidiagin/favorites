import { useEffect, useState } from 'react'

/** Turns a Blob into a temporary URL for <img src>, and frees it when the blob changes or on unmount. */
export function useObjectUrl(blob: Blob | undefined): string | undefined {
  const [url, setUrl] = useState<string>()

  // An object URL is an external resource: it must be created and revoked in an effect.
  // Creating it during render (useMemo) breaks in StrictMode: the dev double-run revokes
  // the URL that is still in use.
  /* oxlint-disable react/set-state-in-effect */
  useEffect(() => {
    if (!blob) {
      setUrl(undefined)
      return
    }
    const next = URL.createObjectURL(blob)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [blob])
  /* oxlint-enable react/set-state-in-effect */

  return url
}
