import React, { useState, useEffect } from 'react'

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false)
  const origin = window?.location.origin ? window.location.origin : ''

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return ''
  }

  return origin
}
