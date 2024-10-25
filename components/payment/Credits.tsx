// components/Credits.tsx

'use client'

import { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard, DollarSign } from 'lucide-react'
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * Custom hook to initialize Razorpay dynamically by loading the script only once.
 */
const useRazorpay = () => {
  const scriptLoaded = useRef(false)

  const initializeRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window === 'undefined') {
        return resolve(false)
      }

      if (scriptLoaded.current) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.id = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'

      script.onload = () => {
        scriptLoaded.current = true
        resolve(true)
      }
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  return initializeRazorpay
}

// Supported currencies by Razorpay (limited to INR and USD)
const currencies = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
]

interface Transaction {
  id: string
  currency: string
  amount: number
  created_at: number // timestamp
  status: string // Payment status
  invoice_link?: string // optional
}

export default function Credits() {
  const [credits, setCredits] = useState<number>(4.2) // Fixed initial credits in USD
  const [addCreditsAmount, setAddCreditsAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [currency, setCurrency] = useState<string>('USD')
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)
  const [isTransactionsLoading, setIsTransactionsLoading] = useState<boolean>(false)

  const initializeRazorpay = useRazorpay()

  /**
   * Fetches the transaction history for the user.
   */
  const fetchTransactions = async () => {
    setIsTransactionsLoading(true)
    try {
      const userToken = localStorage.getItem('access_token') || ''

      const response = await axios.get('/api/transactions', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })
      const payments = response.data.payments as Transaction[]

      setTransactions(payments)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setAlert({ type: 'error', message: 'Failed to fetch transactions.' })
    }
    setIsTransactionsLoading(false)
  }

  /**
   * Handles the Add Credits process.
   */
  const handleAddCredits = async () => {
    if (!addCreditsAmount || Number(addCreditsAmount) <= 0) {
      setAlert({ type: 'error', message: 'Please enter a valid amount.' })
      return
    }

    // Ensure the amount has at most two decimal places
    const formattedAmount = parseFloat(Number(addCreditsAmount).toFixed(2))

    setLoading(true)
    try {
      // Close the Add Credits dialog before opening Razorpay
      setIsDialogOpen(false)

      const paymentSuccess = await makePayment(formattedAmount)
      if (paymentSuccess) {
        // Update credits locally
        setCredits((prev) => prev + paymentSuccess)
        setAddCreditsAmount('')
        setAlert({ type: 'success', message: 'Credits added successfully!' })

        // Refresh transactions
        await fetchTransactions()
      } else {
        setAlert({ type: 'error', message: 'Payment failed or was canceled.' })
      }
    } catch (error) {
      console.error(error)
      setAlert({ type: 'error', message: 'An error occurred during the payment process.' })
    }
    setLoading(false)
  }

  /**
   * Initiates the Razorpay payment process.
   */
  const makePayment = (formattedAmount: number): Promise<number | false> => {
    return new Promise(async (resolve) => {
      const res = await initializeRazorpay()

      if (!res) {
        setAlert({ type: 'error', message: 'Razorpay SDK failed to load.' })
        return resolve(false)
      }

      // Get user token
      const userToken = localStorage.getItem('access_token') || ''
      if (!userToken) {
        setAlert({ type: 'error', message: 'User not authenticated.' })
        return resolve(false)
      }

      // Assume that user ID is stored in localStorage or accessible via context
      const userId = localStorage.getItem('user_id') || '' // Replace with actual user ID fetching

      if (!userId) {
        setAlert({ type: 'error', message: 'User ID not found.' })
        return resolve(false)
      }

      // Make API call to Next.js /api/order to create an order
      const orderResponse = await axios.post('/api/order', {
        amount: formattedAmount,
        currency: currency,
        userId: userId,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        }
      }).catch((err) => {
        console.error('Error creating order:', err)
        setAlert({ type: 'error', message: 'Error creating order.' })
        return null
      })

      if (!orderResponse || orderResponse.status !== 200) {
        setAlert({ type: 'error', message: 'Failed to create order.' })
        return resolve(false)
      }

      const order = orderResponse.data

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
        currency: order.currency,
        amount: order.amount.toString(), // amount in smallest unit
        order_id: order.id,
        name: 'Your Company Pvt Ltd',
        description: 'Credits Purchase',
        image: '/your-logo.png',
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id
          const orderId = response.razorpay_order_id
          const signature = response.razorpay_signature

          // Verify payment on Next.js backend
          const verifyResponse = await axios.post('/api/verify', {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
            userToken: userToken, // Pass user token for Flask backend
          }).catch((err) => {
            console.error('Error verifying payment:', err)
            setAlert({ type: 'error', message: 'Error verifying payment.' })
            return null
          })

          if (verifyResponse && verifyResponse.data.success) {
            resolve(verifyResponse.data.amountUSD)
          } else {
            setAlert({ type: 'error', message: verifyResponse?.data?.error || 'Payment verification failed.' })
            resolve(false)
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#4F46E5',
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on('payment.failed', function (response: any) {
        console.error(response)
        setAlert({ type: 'error', message: 'Payment failed.' })
        resolve(false)
      })

      paymentObject.open()
    })
  }

  /**
   * Returns the currency symbol based on the currency code.
   */
  const getCurrencySymbol = (code: string) => {
    return currencies.find((c) => c.code === code)?.symbol || code
  }

  return (
    <>
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            variant={alert.type === 'success' ? 'success' : 'destructive'}
            onClose={() => setAlert(null)}
          >
            <AlertTitle>
              {alert.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="w-full max-w-lg mx-auto shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="text-center">
            <div className="text-4xl font-bold flex items-center justify-center gap-2">
              <DollarSign className="w-8 h-8 text-indigo-500" />
              {credits.toFixed(2)}
            </div>
            <p className="text-gray-500 mt-2">Available Credits (USD)</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Add Credits
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Credits</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={currency}
                    onValueChange={(value) => setCurrency(value)}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} ({c.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {getCurrencySymbol(currency)}
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      value={addCreditsAmount}
                      onChange={(e) => setAddCreditsAmount(e.target.value)}
                      className="pl-8"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleAddCredits}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? 'Processing...' : 'Add Credits'}
              </Button>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-6 bg-gray-100 rounded-b-lg">
          <p className="text-sm text-gray-600">Current currency: {currency}</p>
          <Button
            variant="outline"
            size="sm"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            onClick={() => {
              setIsHistoryOpen(true)
              fetchTransactions()
            }}
          >
            View Transaction History
          </Button>
        </CardFooter>
      </Card>

      {/* Transaction History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogTrigger asChild>
          {/* Hidden trigger, opened programmatically */}
          <></>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isTransactionsLoading ? (
              <div className="flex justify-center items-center py-10">
                {/* Simple Loading Spinner */}
                <svg
                  className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500">No transactions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Transaction ID</th>
                      <th className="px-4 py-2">Amount (USD)</th>
                      <th className="px-4 py-2">Currency</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="text-center">
                        <td className="border px-4 py-2 break-all">{tx.transaction_id}</td>
                        <td className="border px-4 py-2">{tx.amount.toFixed(2)}</td>
                        <td className="border px-4 py-2">{tx.currency}</td>
                        <td className="border px-4 py-2">
                          {new Date(tx.created_at * 1000).toLocaleString()}
                        </td>
                        <td className="border px-4 py-2">
                          {/* Display payment status with color coding */}
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tx.status === 'captured'
                                ? 'bg-green-100 text-green-800'
                                : tx.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : tx.status === 'authorized'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td className="border px-4 py-2">
                          {/* Placeholder for invoice link */}
                          <a
                            href={`https://dashboard.razorpay.com/payments/${tx.payment_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline"
                          >
                            View Invoice
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
