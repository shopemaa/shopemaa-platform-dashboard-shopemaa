export function formatCurrency(shop, amount) {
    return `${getCurrencySign(shop.currency)}${(amount / 100).toFixed(2)}`
}

export function formatCurrencyR(shop, amount) {
    return `${(amount / 100).toFixed(2)} ${shop.currency.toUpperCase()}`
}

export function getCurrencySign(currency) {
    switch (currency.toLowerCase()) {
        case 'eur':
            return '€';
        case 'bdt':
            return '৳';
        default:
            return '$'
    }
}

export function calculateDiscount(discount, amount) {
    return amount - ((amount * discount) / 100)
}
