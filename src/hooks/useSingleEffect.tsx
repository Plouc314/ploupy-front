// react
import { useState, useEffect, useRef } from 'react'

/**
 * Equivalent of useEffect(..., []) but effectively
 * called once.
 */
const useSingleEffect = (cb: () => void) => {
  const isCalled = useRef(false)

  useEffect(() => {
    if (isCalled.current) return
    isCalled.current = true
    cb()
  }, [])
}

export default useSingleEffect