'use client'
import { useWallet } from '../../context/WalletContext'
import { FiInfo } from 'react-icons/fi'
import PiggyInterface from '../../components/PiggyInterface'

export default function Home() {
  const { connectWallet, account } = useWallet()

  return (
    <div className="container mx-auto px-4 py-8">
      {!account ? (
        <button
          onClick={connectWallet}
          className="btn btn-primary w-full"
        >
          Connect Wallet
        </button>
      ) : (
        <PiggyInterface />
      )}
    </div>
  )
} 
