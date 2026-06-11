import { useMemo, useState } from 'react'
import type { EmployeeRef } from '../../types'

const MAX_SUGGESTIONS = 8

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
}

interface UseEmployeeSearchResult {
  query: string
  isOpen: boolean
  suggestions: EmployeeRef[]
  setQuery: (query: string) => void
  open: () => void
  close: () => void
  select: (employee: EmployeeRef) => void
}

export function useEmployeeSearch(
  employees: EmployeeRef[],
  onSelect: (registration: string) => void,
): UseEmployeeSearchResult {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const suggestions = useMemo(() => {
    const term = fold(query.trim())
    if (term === '') return []
    return employees
      .filter((e) => fold(e.name).includes(term) || e.registration.startsWith(term))
      .slice(0, MAX_SUGGESTIONS)
  }, [employees, query])

  const select = (employee: EmployeeRef) => {
    onSelect(employee.registration)
    setQuery('')
    setIsOpen(false)
  }

  return {
    query,
    isOpen,
    suggestions,
    setQuery,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    select,
  }
}
