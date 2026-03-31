'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type CheckoutModule = {
  DodoPayments: {
    Initialize: (options: { mode: string }) => void;
    Checkout: {
      open: (options: {
        checkoutUrl: string;
        onSuccess?: (data: unknown) => void;
        onError?: (error: unknown) => void;
      }) => void;
    };
  };
};

export default function CheckoutContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const hasStarted = useRef(false);
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState('');

  const productId = getParam(searchParams.productId);
  const plan = getParam(searchParams.plan) || 'PRO';
  const interval = getParam(searchParams.interval) || 'monthly';

  useEffect(() => {
    if (!productId || hasStarted.current) {
      if (!productId) {
        setStatus('error');
        setErrorMessage('Missing product details for checkout.');
      }
      return;
    }

    hasStarted.current = true;

    const startCheckout = async () => {
      try {
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          const errorMsg =
            typeof responseData.details === 'object'
              ? JSON.stringify(responseData.details)
              : responseData.details ||
                responseData.error ||
                'Failed to create checkout session';
          throw new Error(errorMsg);
        }

        if (!responseData.checkout_url) {
          throw new Error('No checkout URL returned from payment provider');
        }

        setStatus('redirecting');

        const checkoutModule = (await import(
          'dodopayments-checkout'
        )) as CheckoutModule;
        const { toast } = await import('sonner');

        checkoutModule.DodoPayments.Initialize({
          mode: 'test',
        });

        checkoutModule.DodoPayments.Checkout.open({
          checkoutUrl: responseData.checkout_url,
          onSuccess: () => {
            toast.success('Upgrade successful! Your features are being unlocked.');
            router.push('/dashboard');
            router.refresh();
          },
          onError: (error: unknown) => {
            console.error('Payment error', error);
            toast.error('Something went wrong. Please try again.');
            setStatus('error');
            setErrorMessage('The checkout window failed to open.');
          },
        });
      } catch (error) {
        console.error('Checkout error:', error);
        setStatus('error');
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to initialize checkout.',
        );
      }
    };

    void startCheckout();
  }, [productId, router]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl items-center px-4 py-12">
      <Card className="w-full rounded-3xl border-none bg-white p-8 shadow-xl dark:bg-zinc-900">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-black text-zinc-900 dark:text-white">
              Complete your {plan} upgrade
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              We are preparing your {interval} checkout session.
            </p>
          </div>
          <CreditCard className="h-10 w-10 text-indigo-500" />
        </div>

        {status !== 'error' ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-zinc-50 px-6 py-12 text-center dark:bg-zinc-800/60">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {status === 'redirecting'
                ? 'Opening secure checkout...'
                : 'Creating checkout session...'}
            </p>
            <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
              Keep this tab open while the checkout SDK loads. You will return to
              the dashboard when payment completes.
            </p>
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl bg-red-50 px-6 py-8 dark:bg-red-950/20">
            <p className="text-lg font-bold text-red-700 dark:text-red-300">
              Checkout could not be started
            </p>
            <p className="text-sm text-red-600 dark:text-red-200">
              {errorMessage}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => window.location.reload()} className="rounded-xl">
                Try Again
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
