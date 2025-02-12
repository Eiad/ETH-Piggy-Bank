import '../src/app/globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Crypto Piggy Bank',
  description: 'Lock your ETH with a time lock',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}