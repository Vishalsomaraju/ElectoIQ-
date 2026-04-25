import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { PAGE_CONTEXT } from '../../constants'

export function RouteStateSync() {
  const location = useLocation()
  const { dispatch } = useAppContext()

  useEffect(() => {
    const context = PAGE_CONTEXT[location.pathname]
    if (!context) return

    dispatch({ type: 'SET_PAGE', payload: context.page })
    dispatch({ type: 'SET_SUGGESTED_QUESTIONS', payload: context.suggestedQuestions })
    dispatch({ type: 'SET_CHAT_CONTEXT', payload: null })
  }, [dispatch, location.pathname])

  return null
}
