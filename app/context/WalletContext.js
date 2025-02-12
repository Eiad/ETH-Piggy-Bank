'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract'
import toast from 'react-hot-toast'

const WalletContext = createContext({})

export function WalletProvider({ children }) {
  const [account, setAccount] = useState('')
  const [deposit, setDeposit] = useState({ amount: '0', unlockTime: '0' })
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [lastFetchedAddress, setLastFetchedAddress] = useState('')
  const [transactions, setTransactions] = useState([])
  const fetchTimeoutRef = useRef(null)

  const fetchPastTransactions = async (userAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      
      // Get past Deposited events
      const filter = contract.filters.Deposited(userAddress)
      const events = await contract.queryFilter(filter)
      
      // Format events into transactions
      const pastTransactions = events.map(event => ({
        hash: event.transactionHash,
        type: 'deposit',
        amount: ethers.formatEther(event.args[1]), // amount
        timestamp: new Date(Number(event.args[2]) * 1000).toISOString(), // unlockTime
        status: 'confirmed',
        blockNumber: event.blockNumber
      }))
      
      setTransactions(prev => [...pastTransactions, ...prev.filter(t => 
        !pastTransactions.some(pt => pt.hash === t.hash)
      )])
    } catch (error) {
      console.error('Error fetching past transactions:', error)
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask!')
        return
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const connectedAccount = accounts[0]
      setAccount(connectedAccount)
      localStorage.setItem('connectedAccount', connectedAccount)
      await getDeposit(connectedAccount)
      await fetchPastTransactions(connectedAccount)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const getDeposit = async (userAddress) => {
    if (!userAddress) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      console.log(`Fetching deposit for address: ${userAddress}`);
      const result = await contract.getDeposit(userAddress);
      
      console.log('Raw deposit result:', result);
      
      // Handle both tuple and array responses
      const amount = result.amount || result[0];
      const unlockTime = result.unlockTime || result[1];
      
      console.log('Parsed values:', {
        amount: amount.toString(),
        unlockTime: unlockTime.toString()
      });
      
      setDeposit({
        amount: ethers.formatEther(amount),
        unlockTime: new Date(Number(unlockTime) * 1000).toLocaleString()
      });
      setLastFetchedAddress(userAddress);
      
    } catch (error) {
      console.error('Error fetching deposit:', error);
      // Don't show error toast for empty deposits
      if (error.code === 'BAD_DATA') {
        console.log('No deposit found for address');
        setDeposit({ amount: '0', unlockTime: '0' });
      } else {
        toast.error('Error fetching deposit details');
      }
    }
  };

  const handleDeposit = async (depositAmount, lockTime) => {
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      console.log('Depositing:', { depositAmount, lockTime })
      
      const tx = await contract.deposit(
        Number(lockTime) * 60,
        { value: ethers.parseEther(depositAmount) }
      )
      
      // Add transaction to history immediately
      setTransactions(prev => [{
        hash: tx.hash,
        type: 'deposit',
        amount: depositAmount,
        timestamp: new Date().toISOString(),
        status: 'unfinalized'
      }, ...prev])

      const receipt = await tx.wait()
      
      // Update transaction status after confirmation
      setTransactions(prev => prev.map(t => 
        t.hash === tx.hash 
          ? {
              ...t, 
              status: receipt.status === 1 ? 'confirmed' : 'failed',
              blockNumber: receipt.blockNumber
            } 
          : t
      ))

      // Force an immediate deposit check
      await getDeposit(account)

      toast.success(`Successfully deposited ${depositAmount} ETH`)
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

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const savedAccount = localStorage.getItem('connectedAccount')
        
        if (accounts.length > 0 && savedAccount && accounts.includes(savedAccount)) {
          setAccount(savedAccount)
          if (savedAccount !== lastFetchedAddress) {
            await getDeposit(savedAccount)
            await fetchPastTransactions(savedAccount)
          }
        } else {
          localStorage.removeItem('connectedAccount')
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    } finally {
      setIsInitialized(true)
    }
  }

  const checkContractDeposit = async (userAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      
      console.log('Checking contract deposit for:', userAddress)
      const result = await contract.getDeposit(userAddress)
      
      console.log('Raw contract deposit:', {
        amount: result[0].toString(),
        unlockTime: result[1].toString(),
        formattedAmount: ethers.formatEther(result[0]),
        formattedTime: new Date(Number(result[1]) * 1000).toLocaleString()
      })
      
      return {
        amount: ethers.formatEther(result[0]),
        unlockTime: new Date(Number(result[1]) * 1000).toLocaleString()
      }
    } catch (error) {
      console.error('Error checking contract deposit:', error)
      return null
    }
  }

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount('')
          localStorage.removeItem('connectedAccount')
          setLastFetchedAddress('')
        } else {
          const newAccount = accounts[0]
          setAccount(newAccount)
          localStorage.setItem('connectedAccount', newAccount)
          getDeposit(newAccount)
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {})
        window.ethereum.removeListener('chainChanged', () => {})
      }
    }
  }, [])

  return (
    <WalletContext.Provider value={{
      account,
      deposit,
      loading,
      isInitialized,
      transactions,
      connectWallet,
      handleDeposit,
      handleWithdraw,
      checkContractDeposit
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext); 