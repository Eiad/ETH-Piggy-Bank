import '../src/app/globals.css'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './context/WalletContext'

export const metadata = {
  title: 'Crypto Piggy Bank',
  description: 'Lock your ETH with a time lock',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <WalletProvider>
          <Toaster position="top-right" />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}