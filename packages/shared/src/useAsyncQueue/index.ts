import { reactive } from '@solidjs-use/solid-to-vue'
import { createSignal } from 'solid-js'
import { noop } from '../utils'
import type { Accessor } from 'solid-js'

export type UseAsyncQueueTask<T> = (...args: any[]) => T | Promise<T>

export interface UseAsyncQueueResult<T> {
  state: 'aborted' | 'fulfilled' | 'pending' | 'rejected'
  data: T | null
}

export interface UseAsyncQueueReturn<T> {
  activeIndex: Accessor<number>
  result: T
}

export interface UseAsyncQueueOptions {
  /**
   * Interrupt tasks when current task fails.
   *
   * @default true
   */
  interrupt?: boolean

  /**
   * Trigger it when the tasks fails.
   *
   */
  onError?: () => void

  /**
   * Trigger it when the tasks ends.
   *
   */
  onFinished?: () => void

  /**
   * A AbortSignal that can be used to abort the task.
   */
  signal?: AbortSignal
}

/**
 * Asynchronous queue task controller.
 *
 * @see https://solidjs-use.github.io/solidjs-use/shared/useAsyncQueue
 */
export function useAsyncQueue<T1>(
  tasks: [UseAsyncQueueTask<T1>],
  options?: UseAsyncQueueOptions
): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>]>
export function useAsyncQueue<T1, T2>(
  tasks: [UseAsyncQueueTask<T1>, UseAsyncQueueTask<T2>],
  options?: UseAsyncQueueOptions
): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>, UseAsyncQueueResult<T2>]>
export function useAsyncQueue<T1, T2, T3>(
  tasks: [UseAsyncQueueTask<T1>, UseAsyncQueueTask<T2>, UseAsyncQueueTask<T3>],
  options?: UseAsyncQueueOptions
): UseAsyncQueueReturn<[UseAsyncQueueResult<T1>, UseAsyncQueueResult<T2>, UseAsyncQueueResult<T3>]>
export function useAsyncQueue<T1, T2, T3, T4>(
  tasks: [UseAsyncQueueTask<T1>, UseAsyncQueueTask<T2>, UseAsyncQueueTask<T3>, UseAsyncQueueTask<T4>],
  options?: UseAsyncQueueOptions
): UseAsyncQueueReturn<
  [UseAsyncQueueResult<T1>, UseAsyncQueueResult<T2>, UseAsyncQueueResult<T3>, UseAsyncQueueResult<T4>]
>
export function useAsyncQueue<T1, T2, T3, T4, T5>(
  tasks: [
    UseAsyncQueueTask<T1>,
    UseAsyncQueueTask<T2>,
    UseAsyncQueueTask<T3>,
    UseAsyncQueueTask<T4>,
    UseAsyncQueueTask<T5>
  ],
  options?: UseAsyncQueueOptions
): UseAsyncQueueReturn<
  [
    UseAsyncQueueResult<T1>,
    UseAsyncQueueResult<T2>,
    UseAsyncQueueResult<T3>,
    UseAsyncQueueResult<T4>,
    UseAsyncQueueResult<T5>
  ]
>
export function useAsyncQueue<T>(
  tasks: Array<UseAsyncQueueTask<T>>,
  options?: UseAsyncQueueOptions
): UseAsyncQueueReturn<Array<UseAsyncQueueResult<T>>>
export function useAsyncQueue<T = any>(
  tasks: Array<UseAsyncQueueTask<any>>,
  options: UseAsyncQueueOptions = {}
): UseAsyncQueueReturn<Array<UseAsyncQueueResult<T>>> {
  const { interrupt = true, onError = noop, onFinished = noop, signal } = options

  const promiseState: Record<UseAsyncQueueResult<T>['state'], UseAsyncQueueResult<T>['state']> = {
    aborted: 'aborted',
    fulfilled: 'fulfilled',
    pending: 'pending',
    rejected: 'rejected'
  }
  const initialResult = Array.from(new Array(tasks.length), () => ({ state: promiseState.pending, data: null }))
  const result = reactive(initialResult) as Array<UseAsyncQueueResult<T>>

  const [activeIndex, setActiveIndex] = createSignal<number>(-1)

  if (!tasks || tasks.length === 0) {
    onFinished()
    return {
      activeIndex,
      result
    }
  }

  function updateResult(state: UseAsyncQueueResult<T>['state'], res: unknown) {
    setActiveIndex(val => val + 1)
    result[activeIndex()].data = res as T
    result[activeIndex()].state = state
  }

  tasks.reduce((prev, curr) => {
    return prev
      .then(prevRes => {
        if (signal?.aborted) {
          updateResult(promiseState.aborted, new Error('aborted'))
          return
        }

        if (result[activeIndex()]?.state === promiseState.rejected && interrupt) {
          onFinished()
          return
        }

        const done = curr(prevRes).then((currentRes: any) => {
          updateResult(promiseState.fulfilled, currentRes)
          activeIndex() === tasks.length - 1 && onFinished()
          return currentRes
        })

        if (!signal) return done

        return Promise.race([done, whenAborted(signal)])
      })
      .catch(e => {
        if (signal?.aborted) {
          updateResult(promiseState.aborted, e)
          return e
        }

        updateResult(promiseState.rejected, e)
        onError()
        return e
      })
  }, Promise.resolve())

  return {
    activeIndex,
    result
  }
}

function whenAborted(signal: AbortSignal): Promise<never> {
  return new Promise((resolve, reject) => {
    const error = new Error('aborted')

    if (signal.aborted) reject(error)
    else signal.addEventListener('abort', () => reject(error), { once: true })
  })
}
