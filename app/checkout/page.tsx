import CheckoutContent from './checkout-content';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return <CheckoutContent searchParams={params} />;
}
