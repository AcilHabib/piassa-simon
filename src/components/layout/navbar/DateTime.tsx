'use client'
import { FC, useEffect, useState } from 'react'

const DateTime: FC = ({}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString().slice(0, -3))
  const date = new Date()

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString().slice(0, -3))
    }, 1000)
  }, [])

  // prevent hydration error
  const [rendered, setRendered] = useState(false)
  useEffect(() => {
    setRendered(true)
  }, [])

  if (!rendered) return null
  return (
    <div className="flex flex-col items-center justify-center">
      <span>{date.toLocaleDateString()}</span>
      <span>{time}</span>
    </div>
  )
}

export default DateTime
