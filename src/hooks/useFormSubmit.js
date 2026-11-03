import { useCallback, useRef, useState } from 'react'

/**
 * Wraps an API submit function with loading/success/error state and a guard
 * against duplicate submissions. Server-side field errors are pushed back
 * into React Hook Form via setError.
 */
export default function useFormSubmit(submitFn, setError) {
  const [state, setState] = useState({ status: 'idle', message: '' })
  const inFlight = useRef(false)

  const submit = useCallback(
    async (values) => {
      if (inFlight.current) return false
      inFlight.current = true
      setState({ status: 'submitting', message: '' })

      try {
        const data = await submitFn(values)
        setState({ status: 'success', message: data.message })
        return true
      } catch (error) {
        if (error.fieldErrors && setError) {
          Object.entries(error.fieldErrors).forEach(([name, message]) => setError(name, { type: 'server', message }))
        }
        setState({ status: 'error', message: error.message })
        return false
      } finally {
        inFlight.current = false
      }
    },
    [submitFn, setError],
  )

  const reset = useCallback(() => setState({ status: 'idle', message: '' }), [])

  return { ...state, submitting: state.status === 'submitting', submit, reset }
}
