// app/api/verify/route.ts

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import Razorpay from 'razorpay'

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
})

// Hard-coded customer ID and user ID for testing
const CUSTOMER_ID = 'cust_test001' // Replace with actual Razorpay customer ID
const USER_ID = 'user001'

// Function to calculate credits based on amount and exchange rate
const calculateCredits = (amount: number, currency: string, exchangeRate: number): number => {
  // 1 credit = 1 USD
  return currency === 'USD' ? amount : amount / exchangeRate
}

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: 'Missing required fields', isOk: false },
        { status: 400 }
      )
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: 'Payment verification failed', isOk: false },
        { status: 400 }
      )
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id)

    // Fetch order details to get the currency and exchange rate
    const order = await razorpay.orders.fetch(razorpay_order_id)

    // Verify that the order is associated with the correct user and customer
    if (order.notes.user_id !== USER_ID || order.notes.customer_id !== CUSTOMER_ID) {
      return NextResponse.json(
        { message: 'User or Customer mismatch. Payment does not belong to the current user.', isOk: false },
        { status: 400 }
      )
    }

    const exchangeRate = order.currency === 'USD' ? 1 : 84.07 // Predefined exchange rate

    // Calculate the amount in USD
    let amountUSD = 0

    if (payment.currency === 'USD') {
      amountUSD = payment.amount / 100 // converting cents to USD
    } else if (payment.currency === 'INR') {
      amountUSD = (payment.amount / 100) / exchangeRate // converting paise to INR, then to USD
    }

    // Here, you could store the payment details in a database or perform other actions

    console.log(`Payment verified. Amount in USD: ${amountUSD}`)

    return NextResponse.json(
      { message: 'Payment verified successfully', isOk: true, amountUSD },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error verifying payment', isOk: false },
      { status: 500 }
    )
  }
}
