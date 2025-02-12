'use client'
import { useState } from 'react'
import { FiClock, FiLock, FiUnlock } from 'react-icons/fi'
import { useWallet } from '../context/WalletContext'
import TransactionHistory from './TransactionHistory'

export default function PiggyInterface() {
  const { deposit, loading, handleDeposit, handleWithdraw, transactions, checkContractDeposit, account } = useWallet()
  const [depositAmount, setDepositAmount] = useState('')
  const [lockTime, setLockTime] = useState('')

  const onSubmitDeposit = (e) => {
    e.preventDefault()
    handleDeposit(depositAmount, lockTime)
  }

  const checkDeposit = async () => {
    if (!account) return
    const contractDeposit = await checkContractDeposit(account)
    if (contractDeposit) {
      console.log('Contract deposit state:', contractDeposit)
    }
  }

  return (
    <div className="space-y-8">
      <div className="card glass-card overflow-hidden w-full" style={{ animationDelay: '0.2s' }}>
        <div className="text-center p-8 space-y-3">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Current Deposit</h2>
          <p className="text-slate-600 dark:text-slate-400">Your active deposit and unlock time</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-50/50 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-xl p-4 border border-indigo-100/50 dark:border-indigo-800/50">
              <span className="text-sm font-medium text-indigo-600/70 dark:text-indigo-400/70 block mb-1">Deposited Amount</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{deposit.amount}</span>
                <span className="text-sm font-medium text-indigo-600/70 dark:text-indigo-400/70">ETH</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-50/50 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-xl p-4 border border-indigo-100/50 dark:border-indigo-800/50">
              <span className="text-sm font-medium text-indigo-600/70 dark:text-indigo-400/70 block mb-1">Unlock Time</span>
              <div className="flex items-center gap-2">
                <FiClock className="w-5 h-5 text-indigo-500" />
                <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{deposit.unlockTime}</span>
              </div>
              <button
                onClick={checkDeposit}
                className="mt-2 text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Check Contract State
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card glass-card overflow-hidden" style={{ animationDelay: '0.4s' }}>
          <div className="text-center p-8 space-y-3">
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">Withdraw Funds</h2>
            <p className="text-slate-600 dark:text-slate-400">Available after lock period ends</p>
          </div>
          <div className="p-6">
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="btn-secondary w-full group"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-3">
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-3">
                  <span>Withdraw ETH</span>
                  <FiUnlock className="w-5 h-5 transition-transform group-hover:-rotate-12" />
                </span>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={onSubmitDeposit} className="card glass-card overflow-hidden h-fit" style={{ animationDelay: '0.3s' }}>
          <div className="text-center p-8 space-y-3">
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">New Deposit</h2>
            <p className="text-slate-600 dark:text-slate-400">Lock your ETH for a specified time</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (ETH)</label>
                  <span className="text-xs text-slate-500">Min: 0.0001 ETH</span>
                </div>
                <input
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  inputMode="decimal"
                  min="0.0001"
                  value={depositAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(',', '.');
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setDepositAmount(value);
                    }
                  }}
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0.0001) {
                      setDepositAmount('0.0001');
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
                  placeholder="0.0"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lock Time</label>
                  <span className="text-xs text-slate-500">in minutes</span>
                </div>
                <input
                  type="number"
                  min="1"
                  value={lockTime}
                  onChange={(e) => setLockTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
                  placeholder="Enter lock duration"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full group"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-3">
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-3">
                    <span>Lock ETH</span>
                    <FiLock className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      {transactions.length > 0 && <TransactionHistory />}
    </div>
  )
} 