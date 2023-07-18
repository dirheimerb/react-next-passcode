import Passcode from '@/components/Passcode'
import { Analytics } from '@vercel/analytics/react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Passcode />
      <Analytics />
    </main>
  )
}
