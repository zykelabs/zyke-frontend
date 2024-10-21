// app/api/order/route.ts

import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
})

// Hard-coded customer ID and user ID for testing
const CUSTOMER_ID = 'cust_test001' // Replace with actual Razorpay customer ID
const USER_ID = 'user001'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = (await request.json()) as {
      amount: number
      currency: string
    }

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required.' },
        { status: 400 }
      )
    }

    if (!['INR', 'USD'].includes(currency)) {
      return NextResponse.json(
        { error: 'Unsupported currency.' },
        { status: 400 }
      )
    }

    // Convert amount to the smallest currency unit
    const amountInSmallestUnit =
      currency === 'INR' ? Math.round(amount * 100) : Math.round(amount * 100)

    const exchangeRate = currency === 'USD' ? 1 : 84.07 // Predefined exchange rate

    const orderOptions: Razorpay.orders.IOrderCreateOptions = {
      amount: amountInSmallestUnit, // amount in the smallest currency unit
      currency: currency,
      receipt: uuidv4(),
      payment_capture: 1, // auto capture
      notes: {
        user_id: USER_ID, // Associate order with user001
        customer_id: CUSTOMER_ID, // Associate order with customer_test001
      },
    }

    const order = await razorpay.orders.create(orderOptions)

    return NextResponse.json(
      {
        orderId: order.id,
        currency: order.currency,
        amount: order.amount,
        exchangeRate: exchangeRate,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating order.' },
      { status: 500 }
    )
  }
}
