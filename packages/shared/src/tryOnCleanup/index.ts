import { getOwner, onCleanup } from 'solid-js'
import type { Fn } from '../utils'

/**
 * Call OnCleanup() if it's inside a component lifecycle, if not, do nothing
 */
export function tryOnCleanup(fn: Fn) {
  if (getOwner()) {
    onCleanup(fn)
    return true
  }
  return false
}
