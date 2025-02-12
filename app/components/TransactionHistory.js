'use client'
import { useWallet } from '../context/WalletContext'
import { FiExternalLink, FiClock, FiCheck, FiX } from 'react-icons/fi'

export default function TransactionHistory() {
  const { transactions } = useWallet()

  return (
    <div className="card glass-card overflow-hidden" style={{ animationDelay: '0.4s' }}>
      <div className="text-center p-8 space-y-3">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Transaction History</h2>
        <p className="text-slate-600 dark:text-slate-400">Your deposit history</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.hash} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                {tx.status === 'unfinalized' && <FiClock className="w-5 h-5 text-yellow-500" />}
                {tx.status === 'confirmed' && <FiCheck className="w-5 h-5 text-green-500" />}
                {tx.status === 'failed' && <FiX className="w-5 h-5 text-red-500" />}
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {tx.amount} ETH
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                <span className="text-sm">View on Etherscan</span>
                <FiExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 