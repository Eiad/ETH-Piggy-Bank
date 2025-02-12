'use client'
import { useWallet } from '../context/WalletContext'
import ConnectWallet from '../components/ConnectWallet'
import PiggyInterface from '../components/PiggyInterface'

export default function PiggyBank() {
  const { account, isInitialized } = useWallet()

  if (!isInitialized) {
    return null // Prevent flashing annoying effect
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <header className="text-center space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="relative inline-block animate-float">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 text-transparent bg-clip-text pb-2">
              Crypto Piggy Bank
            </h1>
            <span className="absolute -right-8 -top-4 text-6xl md:text-7xl animate-float" style={{ animationDelay: '0.5s' }}>
              🐷
            </span>
          </div>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Secure your ETH with time-locked savings. Set a duration, deposit your funds, and ensure they remain untouched until the specified time.
          </p>
        </header>
        
        {!account ? <ConnectWallet /> : <PiggyInterface />}
      </div>
    </main>
  )
} 