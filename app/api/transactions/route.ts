import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    try {
        const { limit } = req.query

        // Get user token from headers
        const userToken = req.headers.authorization || ''

        if (!userToken) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const flaskBackendUrl = process.env.FLASK_BACKEND_URL! // e.g., https://api.yourdomain.com

        const response = await axios.get(`${flaskBackendUrl}/transactions/user`, {
            params: {
                limit: limit || 50,
            },
            headers: {
                'Authorization': userToken, // Pass user's JWT token
            },
        })

        if (response.status === 200) {
            res.status(200).json({ payments: response.data.transactions })
        } else {
            res.status(500).json({ error: 'Failed to fetch transactions' })
        }
    } catch (error: any) {
        console.error('Error fetching transactions:', error)
        res.status(500).json({ error: 'Failed to fetch transactions.' })
    }
}
