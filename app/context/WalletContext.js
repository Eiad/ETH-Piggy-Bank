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
        amount: ethers.formatEther(event.args[1]),
        timestamp: new Date(Number(event.args[2]) * 1000).toISOString(),
        status: 'confirmed',
        blockNumber: event.blockNumber
      }))
      
      setTransactions(prev => [
        ...pastTransactions,
        ...prev.filter(t => !pastTransactions.some(pt => pt.hash === t.hash))
      ])
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
      
      console.log('Fetching deposit for address:', userAddress);
      
      const result = await contract.getDeposit(userAddress);
      console.log('Raw contract response:', result);
      
      if (!result || result === '0x') {
        console.log('No deposit found for address:', userAddress);
        setDeposit({ amount: '0', unlockTime: '0' });
        return;
      }
      
      const amount = result.amount || result[0];
      const unlockTime = result.unlockTime || result[1];
      
      if (amount == 0 || amount === 0n) {
        console.log('No deposit found for address:', userAddress);
        setDeposit({ amount: '0', unlockTime: '0' });
        return;
      }
      
      setDeposit({
        amount: ethers.formatEther(amount),
        unlockTime: Number(unlockTime) === 0 
          ? '0' 
          : new Date(Number(unlockTime) * 1000).toLocaleString()
      });
      setLastFetchedAddress(userAddress);
      
    } catch (error) {
      if (error.code === 'BAD_DATA') {
        console.log('No deposit found for address:', userAddress);
      } else {
        console.error('Error fetching deposit:', error);
      }
      setDeposit({ amount: '0', unlockTime: '0' });
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
      
      // Add transaction to history immediately as "unfinalized"
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
      
      // Refresh the deposit state & history after confirmation
      await getDeposit(account)
      await fetchPastTransactions(account)
      
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      console.log('Checking deposit for address:', userAddress);
      
      const result = await contract.getDeposit(userAddress);
      console.log('Raw contract response:', result);
      
      if (!result || result === '0x') {
        console.log('No deposit found for address:', userAddress);
        return { amount: '0', unlockTime: '0' };
      }
      
      const amount = result.amount || result[0];
      const unlockTime = result.unlockTime || result[1];
      
      if (amount == 0 || amount === 0n) {
        console.log('No deposit found for address:', userAddress);
        return { amount: '0', unlockTime: '0' };
      }
      
      return {
        amount: ethers.formatEther(amount),
        unlockTime: Number(unlockTime) === 0 
          ? '0' 
          : new Date(Number(unlockTime) * 1000).toLocaleString()
      };
      
    } catch (error) {
      if (error.code === 'BAD_DATA') {
        console.log('No deposit found for address:', userAddress);
      } else {
        console.error('Error checking deposit:', error);
      }
      return { amount: '0', unlockTime: '0' };
    }
  };

  const listenToDepositEvents = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const depositListener = (user, amount, unlockTime, event) => {
        console.log('Deposit event received:', {
          user,
          amount: ethers.formatEther(amount),
          unlockTime: new Date(Number(unlockTime) * 1000).toLocaleString(),
          txHash: event.transactionHash,
        });
        
        if (account && user.toLowerCase() === account.toLowerCase()) {
          // Refresh the deposit state
          getDeposit(account);
          // Synchronize transaction history with this event if not already present
          setTransactions(prev => {
            if (prev.some(tx => tx.hash === event.transactionHash)) return prev;
            return [{
              hash: event.transactionHash,
              type: 'deposit',
              amount: ethers.formatEther(amount),
              timestamp: new Date().toISOString(),
              status: 'confirmed',
              blockNumber: event.blockNumber
            }, ...prev];
          });
        }
      };
      
      contract.on('Deposited', depositListener);
    } catch (error) {
      console.error('Error setting up deposit event listener:', error);
    }
  };

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

  useEffect(() => {
    if (account) {
      listenToDepositEvents();
    }
    
    return () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      contract.removeAllListeners('Deposited');
    };
  }, [account]);

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