'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract'
import toast from 'react-hot-toast'
import { FiInfo, FiClock, FiLock, FiUnlock, FiArrowRight } from 'react-icons/fi'

export default function Home() {
  const [account, setAccount] = useState('')
  const [deposit, setDeposit] = useState({ amount: '0', unlockTime: '0' })
  const [depositAmount, setDepositAmount] = useState('')
  const [lockTime, setLockTime] = useState('')
  const [loading, setLoading] = useState(false)

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask!')
        return
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      await getDeposit(accounts[0])
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const getDeposit = async (userAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const result = await contract.getDeposit(userAddress)
      setDeposit({
        amount: ethers.formatEther(result[0]),
        unlockTime: new Date(Number(result[1]) * 1000).toLocaleString()
      })
    } catch (error) {
      console.error('Error fetching deposit:', error)
    }
  }

  const handleDeposit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      const tx = await contract.deposit(
        Number(lockTime) * 60,
        { value: ethers.parseEther(depositAmount) }
      )
      
      toast.promise(tx.wait(), {
        loading: 'Confirming transaction...',
        success: 'Deposit successful!',
        error: 'Transaction failed'
      })
      
      await tx.wait()
      await getDeposit(account)
    } catch (error) {
      console.error('Error depositing:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      const tx = await contract.withdraw()
      
      toast.promise(tx.wait(), {
        loading: 'Confirming withdrawal...',
        success: 'Withdrawal successful!',
        error: 'Withdrawal failed'
      })
      
      await tx.wait()
      await getDeposit(account)
    } catch (error) {
      console.error('Error withdrawing:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0])
        getDeposit(accounts[0])
      })
    }
  }, [])

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-[1400px] mx-auto space-y-12">
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
        
        {!account ? (
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
        ) : (
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

              <form onSubmit={handleDeposit} className="card glass-card overflow-hidden h-fit" style={{ animationDelay: '0.3s' }}>
                <div className="text-center p-8 space-y-3">
                  <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">New Deposit</h2>
                  <p className="text-slate-600 dark:text-slate-400">Lock your ETH for a specified time</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (ETH)</label>
                        <span className="text-xs text-slate-500">Min: 0.01 ETH</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
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
          </div>
        )}
      </div>
    </main>
  )
} 