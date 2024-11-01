"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreditCard, DollarSign, RefreshCw } from "lucide-react"
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "next-auth/react"

interface Transaction {
  _id: string
  user_id: string
  transaction_id: string
  amount: number
  currency: string
  status: string
  invoice_link?: string
  created_at: string
  updated_at: string
}

interface UserData {
  email: string
  first_name: string
  last_name: string
  contact: string
  is_admin: boolean
}

export default function Component() {
  const [credits, setCredits] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [addCreditsAmount, setAddCreditsAmount] = useState<string>("")
  const [currency, setCurrency] = useState<string>("USD")
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [alert, setAlert] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false)
  const [isTransactionsLoading, setIsTransactionsLoading] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const { data: session, status } = useSession()

  const [adminUserId, setAdminUserId] = useState<string>("")
  const [adminTransactions, setAdminTransactions] = useState<Transaction[]>([])
  const [isAdminHistoryOpen, setIsAdminHistoryOpen] = useState<boolean>(false)
  const [isAdminTransactionsLoading, setIsAdminTransactionsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData()
      fetchUserCredits()
      fetchTransactions()
    }
  }, [status, session])

  const fetchUserData = async () => {
    try {
      const accessToken = session?.accessToken
      if (!accessToken) {
        setAlert({ type: "error", message: "No access token found." })
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        setUserData(response.data as UserData)
      }
    } catch (error: any) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      )
      setAlert({ type: "error", message: "Error fetching user data." })
    }
  }

  const fetchUserCredits = async () => {
    try {
      const accessToken = session?.accessToken
      if (!accessToken) {
        setAlert({ type: "error", message: "No access token found." })
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/credits`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        setCredits(response.data.credits)
      } else {
        setAlert({ type: "error", message: "Failed to fetch credits." })
      }
    } catch (error: any) {
      console.error(
        "Error fetching credits:",
        error.response?.data || error.message
      )
      setAlert({
        type: "error",
        message: error.response?.data?.msg || "Failed to fetch credits.",
      })
    }
  }

  const fetchTransactions = async () => {
    setIsTransactionsLoading(true)
    try {
      const accessToken = session?.accessToken
      if (!accessToken) {
        setAlert({ type: "error", message: "No access token found." })
        setIsTransactionsLoading(false)
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/history`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      setTransactions(response.data.transactions as Transaction[])
    } catch (error: any) {
      console.error(
        "Error fetching transactions:",
        error.response?.data || error.message
      )
      setAlert({
        type: "error",
        message: error.response?.data?.msg || "Failed to fetch transactions.",
      })
    }
    setIsTransactionsLoading(false)
  }

  const fetchAdminTransactions = async (userId: string) => {
    setIsAdminTransactionsLoading(true)
    try {
      const accessToken = session?.accessToken
      if (!accessToken) {
        setAlert({ type: "error", message: "No access token found." })
        setIsAdminTransactionsLoading(false)
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      setAdminTransactions(response.data.transactions as Transaction[])
    } catch (error: any) {
      console.error(
        "Error fetching admin transactions:",
        error.response?.data || error.message
      )
      setAlert({
        type: "error",
        message:
          error.response?.data?.msg || "Failed to fetch admin transactions.",
      })
    }
    setIsAdminTransactionsLoading(false)
  }

  const handleAddCredits = async () => {
    if (!addCreditsAmount || Number(addCreditsAmount) <= 0) {
      setAlert({ type: "error", message: "Please enter a valid amount." })
      return
    }

    const formattedAmount = parseFloat(Number(addCreditsAmount).toFixed(2))
    setLoading(true)
    try {
      setIsDialogOpen(false)



      const paymentSuccess = await makePayment(formattedAmount)
      if (paymentSuccess) {
        await fetchUserCredits()
        setAddCreditsAmount("")
        setAlert({ type: "success", message: "Payment successful! Credits will be updated shortly." })
      } else {
        setAlert({ type: "error", message: "Payment failed or was canceled." })
      }
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "An error occurred during the payment process.",
      })
    }
    setLoading(false)
  }

  const makePayment = (formattedAmount: number): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const res = await initializeRazorpay();
  
      if (!res) {
        setAlert({ type: "error", message: "Razorpay SDK failed to load." });
        return resolve(false);
      }
  
      const accessToken = session?.accessToken;
      if (!accessToken) {
        setAlert({ type: "error", message: "No access token found." });
        return resolve(false);
      }
  
      const orderResponse = await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/add`,
          { amount: formattedAmount, currency },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {
          console.error(
            "Error creating order:",
            err.response?.data || err.message
          );
          setAlert({ type: "error", message: "Error creating order." });
          return null;
        });
  
      if (!orderResponse || orderResponse.status !== 200) {
        setAlert({ type: "error", message: "Failed to create order." });
        return resolve(false);
      }
  
      const order = orderResponse.data;
  
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
        currency: order.currency,
        amount: order.amount.toString(),
        order_id: order.order_id,
        name: "Zyke",
        description: "Credits Purchase",
        image: "/your-logo.png",
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id;
          const signature = response.razorpay_signature;
  
          console.log("Payment ID:", paymentId);
          console.log("Order ID:", orderId);
          console.log("Signature:", signature);
  
          setAlert({
            type: "success",
            message: "Payment successful! Credits will be updated shortly.",
          });
  
          resolve(true);
        },
        prefill: {
          name: userData ? `${userData.first_name} ${userData.last_name}` : "",
          email: userData ? userData.email : "",
          contact: userData ? userData.contact : "",
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by the user.");
            setAlert({ type: "error", message: "Payment was canceled." });
            resolve(false);
          },
        },
      };
  
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response);
        setAlert({ type: "error", message: "Payment failed." });
        resolve(false);
      });
  
      paymentObject.open();
    });
  };
  

  const getCurrencySymbol = (code: string) => {
    const currencyMap: { [key: string]: string } = {
      USD: "$",
      INR: "₹",
    }
    return currencyMap[code] || code
  }

  const handleFetchAdminTransactions = async () => {
    if (!adminUserId) {
      setAlert({ type: "error", message: "Please enter a valid User ID." })
      return
    }

    setIsAdminHistoryOpen(true)
    await fetchAdminTransactions(adminUserId)
  }

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      captured: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      authorized: "bg-yellow-100 text-yellow-800",
      created: "bg-blue-100 text-blue-800",
      unknown: "bg-gray-100 text-gray-800",
    }

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusMap[status] || statusMap["unknown"]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const initializeRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") {
        return resolve(false)
      }

      if ((window as any).Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  return (
    <>
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            variant={alert.type === "success" ? "success" : "destructive"}
            onClose={() => setAlert(null)}
          >
            <AlertTitle>
              {alert.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="w-full max-w-lg mx-auto shadow-lg rounded-lg bg-white text-black">
        <CardHeader className="bg-black text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {userData && (
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold">
                {userData.first_name} {userData.last_name}
              </p>
              <p className="text-sm text-gray-400">{userData.email}</p>
            </div>
          )}

          <div className="text-center">
            {credits === null ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-600"
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
            ) : (
              <>
                <div className="text-4xl font-bold flex items-center justify-center gap-2">
                  <DollarSign className="w-8 h-8 text-gray-800" />
                  {credits.toFixed(2)}
                </div>
                <p className="text-gray-500 mt-2">Available Credits</p>
              </>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
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
                    <SelectTrigger className="w-full mt-2 bg-white border border-gray-300">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
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
                      className="pl-8 bg-white border border-gray-300"
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
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                {loading ? "Processing..." : "Add Credits"}
              </Button>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-6 bg-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600">Currency: {currency}</p>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-800 border-gray-800 hover:bg-gray-300"
            onClick={() => {
              setIsHistoryOpen(true)
              fetchTransactions()
            }}
          >
            View Transaction History
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogTrigger asChild>
          <></>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Button
              onClick={() => fetchTransactions()}
              className="mb-4 bg-gray-800 hover:bg-gray-700 text-white"
              disabled={isTransactionsLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {isTransactionsLoading ? (
              <div className="flex justify-center items-center py-10">
                <svg
                  className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-600"
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
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Transaction ID</th>
                      <th className="px-4 py-2 border-b">Amount</th>
                      <th className="px-4 py-2 border-b">Currency</th>
                      <th className="px-4 py-2 border-b">Date</th>
                      <th className="px-4 py-2 border-b">Status</th>
                      <th className="px-4 py-2 border-b">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2 break-all">{tx.transaction_id}</td>
                        <td className="border px-4 py-2">{tx.amount.toFixed(2)}</td>
                        <td className="border px-4 py-2">{tx.currency}</td>
                        <td className="border px-4 py-2">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="border px-4 py-2">
                          {formatStatus(tx.status)}
                        </td>
                        <td className="border px-4 py-2">
                          {tx.invoice_link ? (
                            <a
                              href={tx.invoice_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View Invoice
                            </a>
                          ) : (
                            "N/A"
                          )}
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

      {userData?.is_admin && (
        <Dialog open={isAdminHistoryOpen} onOpenChange={setIsAdminHistoryOpen}>
          <DialogTrigger asChild>
            <></>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto bg-white text-black">
            <DialogHeader>
              <DialogTitle>Admin Transaction History</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="adminUserId">User ID for Transaction History</Label>
                <Input
                  id="adminUserId"
                  type="text"
                  value={adminUserId}
                  onChange={(e) => setAdminUserId(e.target.value)}
                  placeholder="Enter User ID"
                  className="bg-white border border-gray-300"
                />
                <Button
                  onClick={handleFetchAdminTransactions}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                  disabled={isAdminTransactionsLoading}
                >
                  {isAdminTransactionsLoading ? "Loading..." : "Fetch Transactions"}
                </Button>
              </div>

              <div className="py-4">
                {isAdminTransactionsLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-600"
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
                ) : adminTransactions.length === 0 ? (
                  <p className="text-gray-500">No transactions found for this user.</p>
                ) : (
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full table-auto border-collapse">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border-b">Transaction ID</th>
                          <th className="px-4 py-2 border-b">Amount (USD)</th>
                          <th className="px-4 py-2 border-b">Currency</th>
                          <th className="px-4 py-2 border-b">Date</th>
                          <th className="px-4 py-2 border-b">Status</th>
                          <th className="px-4 py-2 border-b">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminTransactions.map((tx) => (
                          <tr key={tx._id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2 break-all">{tx.transaction_id}</td>
                            <td className="border px-4 py-2">{tx.amount.toFixed(2)}</td>
                            <td className="border px-4 py-2">{tx.currency}</td>
                            <td className="border px-4 py-2">
                              {new Date(tx.created_at).toLocaleString()}
                            </td>
                            <td className="border px-4 py-2">
                              {formatStatus(tx.status)}
                            </td>
                            <td className="border px-4 py-2">
                              {tx.invoice_link ? (
                                <a
                                  href={tx.invoice_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  View Invoice
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
