import { useContext } from 'react'
import { ExplorerContext } from '@/context/ExplorerContext'

export function useExplorer() {
  const v = useContext(ExplorerContext)
  if (!v) throw new Error('useExplorer must be used within AppLayout')
  return v
}
