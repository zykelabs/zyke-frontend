// pages/api/verify.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userToken } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userToken) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Verify the signature
        const secret = process.env.RAZORPAY_SECRET!

        const shasum = crypto.createHmac('sha256', secret)
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const digest = shasum.digest('hex')

        if (digest !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid signature' })
        }

        // Fetch payment and order details from Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY!,
            key_secret: process.env.RAZORPAY_SECRET!,
        })

        const payment = await razorpay.payments.fetch(razorpay_payment_id)
        const order = await razorpay.orders.fetch(razorpay_order_id)

        // Calculate amount in USD
        const exchangeRate = 84.07 // Should be dynamic in real scenarios
        let amountUSD = 0
        if (payment.currency === 'USD') {
            amountUSD = payment.amount / 100 // cents to USD
        } else if (payment.currency === 'INR') {
            amountUSD = (payment.amount / 100) / exchangeRate // paise to INR, then to USD
        }

        // Prepare transaction data
        const transactionData = {
            transaction_id: payment.id,
            currency: payment.currency,
            amount: amountUSD,
            original_amount: payment.amount,
            status: payment.status,
            invoice_link: `https://dashboard.razorpay.com/payments/${payment.id}`,
            order_id: order.id,
            payment_id: payment.id,
            signature_verified: true,
        }

        // Send transaction data to Flask backend
        const flaskBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!

        const response = await axios.post(`${flaskBackendUrl}/transactions/add`, transactionData, {
            headers: {
                'Authorization': `Bearer ${userToken}`, // User's JWT token
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 201) {
            res.status(200).json({ success: true, amountUSD })
        } else {
            res.status(500).json({ error: 'Failed to store transaction' })
        }
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
