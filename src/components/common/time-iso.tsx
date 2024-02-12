'use client'

import { useEffect, useState } from 'react'

export default function TimeISO ({ stringDate }: { stringDate: string }) {
  const [date, setDate] = useState<null | Date>(null)

  useEffect(() => {
    setDate(new Date(stringDate))
  }, [])

  return (
    <>
      {date && (
        <time dateTime={date.toISOString()}>
          {Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium'
          }).format(date)}
        </time>
      )}
    </>
  )
}
