'use client'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-[1200px] mx-auto space-y-12">
        <header className="text-center space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="relative inline-block animate-float">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 text-transparent bg-clip-text pb-2">
              Welcome to Crypto Piggy
            </h1>
            <span className="absolute -right-8 -top-4 text-6xl md:text-7xl animate-float" style={{ animationDelay: '0.5s' }}>
              🐷
            </span>
          </div>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your secure ETH time-lock savings platform. Lock your funds and ensure they remain untouched until you&apos;re ready.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card glass-card overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="text-center p-8 space-y-3">
              <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Time-Locked Savings</h2>
              <p className="text-slate-600 dark:text-slate-400">Set your own lock duration and ensure your savings stay untouched until maturity.</p>
            </div>
          </div>

          <div className="card glass-card overflow-hidden" style={{ animationDelay: '0.3s' }}>
            <div className="text-center p-8 space-y-3">
              <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Smart Contract Security</h2>
              <p className="text-slate-600 dark:text-slate-400">Your funds are secured by blockchain technology, ensuring complete transparency and trust.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/piggy"
            className="btn-primary group inline-flex items-center space-x-2 px-8"
          >
            <span>Get Started</span>
            <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  )
} 