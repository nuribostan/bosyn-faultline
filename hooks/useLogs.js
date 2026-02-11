import { useState, useEffect } from 'react'
import { LogService } from '@/services/logService'

export function useLogs(brand, testId) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, critical: 0 })

  useEffect(() => {
    if (!brand || !testId) return

    async function fetch() {
      setLoading(true)
      try {
        const data = await LogService.getLogsByTest(brand, testId)
        setLogs(data)
        setStats({
          total: data.length,
          critical: data.filter(l => l.severity === 'critical').length
        })
      } catch (err) {
        console.error("Loglar çekilemedi:", err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [brand, testId])

  return { logs, loading, stats }
}