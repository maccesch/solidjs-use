import { toValue } from '@solidjs-use/shared'
import { createEffect, on } from 'solid-js'
import { useAsyncState } from '../useAsyncState'
import type { MaybeAccessor } from '@solidjs-use/shared'
import type { UseAsyncStateOptions } from '../useAsyncState'

export interface UseImageOptions {
  /** Address of the resource */
  src: string
  /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. */
  srcset?: string
  /** Image sizes for different page layouts */
  sizes?: string
  /** Image alternative information */
  alt?: string
  /** Image classes */
  class?: string
  /** Image loading */
  loading?: HTMLImageElement['loading']
  /** Image CORS settings */
  crossorigin?: string
}

function loadImage(options: UseImageOptions): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const { src, srcset, sizes, class: clazz, loading, crossorigin } = options

    img.src = src
    if (srcset) img.srcset = srcset
    if (sizes) img.sizes = sizes
    if (clazz) img.className = clazz
    if (loading) img.loading = loading
    if (crossorigin) img.crossOrigin = crossorigin

    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

/**
 * Reactive load an image in the browser, you can wait the result to display it or show a fallback.
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useImage
 * @param options Image attributes, as used in the <img> tag
 */
export const useImage = (options: MaybeAccessor<UseImageOptions>, asyncStateOptions: UseAsyncStateOptions = {}) => {
  const state = useAsyncState<HTMLImageElement | undefined>(() => loadImage(toValue(options)), undefined, {
    resetOnExecute: true,
    ...asyncStateOptions
  })

  createEffect(
    on(
      () => toValue(options),
      () => {
        state.execute(asyncStateOptions.delay)
      },
      { defer: true }
    )
  )

  return state
}

export type UseImageReturn = ReturnType<typeof useImage>
