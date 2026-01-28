import { NextResponse } from 'next/server';
import { getCompanySession } from '@/lib/auth';
import { DODO_CONFIG } from '@/lib/payment-config';

/**
 * API Route: /api/checkout/session
 * Creates a Dodo Payments checkout session on the server and returns the checkout URL.
 */
export async function POST(req: Request) {
    try {
        const session = await getCompanySession();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            return new NextResponse('Missing productId', { status: 400 });
        }

        const companyId = (session.user as any).id;
        const customerEmail = session.user.email;
        const customerName = session.user.name;

        console.log(`Creating Dodo checkout session for company ${companyId}, product ${productId}`);

        // Construct the Dodo Payments API URL
        const baseUrl = DODO_CONFIG.environment.test; // Hardcoded to test for now as per DODO_CONFIG
        const apiUrl = `${baseUrl}/v1/checkouts`;

        // Create Dodo Payments Checkout Session
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DODO_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_cart: [
                    {
                        product_id: productId,
                        quantity: 1,
                    },
                ],
                customer: {
                    email: customerEmail,
                    name: customerName,
                },
                metadata: {
                    companyId: companyId,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Dodo API Error Response:', errorText);
            return new NextResponse(`Dodo API error: ${errorText}`, { status: response.status });
        }

        const data = await response.json();

        if (!data.checkout_url) {
            console.error('Dodo API did not return a checkout_url:', data);
            return new NextResponse('Dodo API did not return a checkout_url', { status: 500 });
        }

        return NextResponse.json({ checkout_url: data.checkout_url });
    } catch (err) {
        console.error('Checkout session creation failed:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
