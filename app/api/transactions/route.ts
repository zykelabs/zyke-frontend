// app/api/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
})

// Hard-coded customer ID for testing
const CUSTOMER_ID = 'cust_test001' // Replace with actual Razorpay customer ID

interface Transaction {
  id: string
  currency: string
  amount: number
  created_at: number // timestamp
  status: string // Payment status
  invoice_link?: string // optional
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all payments (you might need to paginate or limit the number of payments)
    // For simplicity, fetch the first 50 payments
    const paymentsResponse = await razorpay.payments.all({ count: 50 })

    const payments = paymentsResponse.items as Razorpay.Payment[] // Type assertion

    // Array to hold filtered transactions
    const userTransactions: Transaction[] = []

    // Iterate over payments and filter based on customer_id
    for (const payment of payments) {
      try {
        // Fetch payment details to access status
        const paymentDetails = await razorpay.payments.fetch(payment.id)

        // Fetch order details to access notes
        const order = await razorpay.orders.fetch(payment.order_id)

        if (order.notes && order.notes.customer_id === CUSTOMER_ID) {
          userTransactions.push({
            id: payment.id,
            currency: payment.currency,
            amount: payment.amount / 100, // Convert smallest unit to main unit
            created_at: payment.created_at,
            status: paymentDetails.status, // Include payment status
            // Optionally, add invoice_link if available
          })
        }

        // Optional: Break early if you have enough transactions
        // if (userTransactions.length >= 10) break
      } catch (orderError) {
        console.error(`Error fetching details for payment ${payment.id}:`, orderError)
        // Continue with the next payment
      }
    }

    return NextResponse.json({ payments: userTransactions }, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions.' },
      { status: 500 }
    )
  }
}
