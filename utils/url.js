export function makeInvoiceUrl(orderId) {
    return `https://shopemaa.com/v1/invoice/generate/${orderId}?storeKey=${process.env.NEXT_PUBLIC_APP_KEY}&storeSecret=${process.env.NEXT_PUBLIC_APP_SECRET}`
}
