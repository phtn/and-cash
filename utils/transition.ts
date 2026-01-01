import { startTransition } from 'react'

export const toggleTransition = (toggleFn: VoidFunction) => () => {
  startTransition(() => {
    toggleFn()
  })
}
