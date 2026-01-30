import { NextResponse } from 'next/server';
import { getCompanySession } from '@/lib/auth';
import { DODO_CONFIG } from '@/lib/payment-config';

export async function GET() {
    return NextResponse.json({ status: 'API is working' });
}

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

        console.log(`Creating Dodo Payment for company ${companyId}, product ${productId}`);

        // Dodo Payments API URL
        // User suggested: ${process.env.NEXT_PUBLIC_DODO_TEST_API}/payments
        const dodoBaseUrl = process.env.NEXT_PUBLIC_DODO_TEST_API || "https://test.dodopayments.com";
        const apiUrl = `${dodoBaseUrl}/payments`;

        console.log(`Sending request to Dodo API: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DODO_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                billing: {
                    city: 'City',
                    country: 'US',
                    state: 'State',
                    street: 'Street',
                    zipcode: 10001,
                },
                customer: {
                    email: customerEmail,
                    name: customerName,
                },
                payment_link: true,
                product_cart: [
                    {
                        product_id: productId,
                        quantity: 1,
                    },
                ],
                metadata: {
                    companyId: companyId,
                },
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Dodo API Error (${response.status}):`, errorText);
            try {
                const errorData = JSON.parse(errorText);
                return NextResponse.json(
                    { error: 'Payment link creation failed', details: errorData },
                    { status: response.status }
                );
            } catch (e) {
                return NextResponse.json(
                    { error: 'Payment link creation failed', details: errorText },
                    { status: response.status }
                );
            }
        }

        const data = await response.json();

        if (!data.payment_link) {
            console.error('Dodo API did not return a payment_link:', data);
            return new NextResponse('Dodo API did not return a payment_link', { status: 500 });
        }

        return NextResponse.json({ checkout_url: data.payment_link });
    } catch (err) {
        console.error('Checkout session creation failed:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
