'use client'
import { FiLock, FiArrowRight } from 'react-icons/fi'
import { useWallet } from '../context/WalletContext'

export default function ConnectWallet() {
  const { connectWallet } = useWallet()

  return (
    <div className="card glass-card space-y-8 text-center max-w-3xl mx-auto p-12" style={{ animationDelay: '0.2s' }}>
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-3 text-2xl text-indigo-600 dark:text-indigo-400">
          <FiLock className="w-8 h-8" />
          <h2 className="font-bold">Get Started</h2>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
          Connect your wallet to start saving ETH with time locks. Your funds will be securely stored until the specified unlock time.
        </p>
      </div>
      <button
        onClick={connectWallet}
        className="btn-primary group max-w-md mx-auto"
      >
        <span className="flex items-center justify-center space-x-2">
          Connect Wallet
          <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
    </div>
  )
} 