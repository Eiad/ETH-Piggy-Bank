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
        {/* Add Disclaimer */}
        <div className="max-w-3xl mx-auto px-6 py-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/30">
          <div className="text-center space-y-2">
            <p className="text-yellow-800 dark:text-yellow-200 font-semibold">⚠️ Important Notice</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Before proceeding with any transactions, please be aware that:
            </p>
            <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
              <li>• This is a beta version and may contain undiscovered issues</li>
              <li>• You are using this application at your own risk so test with small amounts</li>
              <li>• We are not liable for any losses or damages</li>
              <li>• Ensure you understand the lock period before depositing</li>
              <li>• Double-check all transaction details before confirming</li>
            </ul>
          </div>
        </div>
                
      </div>
    </main>
  )
} 