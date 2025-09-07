export const formatAmount = (amount, currency, billingCycle) => {
    if (amount === 0 && billingCycle) {
        return 'Free';
    } else if (amount < 0 && billingCycle) {
        return 'Contact Us'
    }

    if (billingCycle) {
        return currency + ' ' + (amount / 100).toFixed(2) + ' /' + formatBillingCycle(billingCycle);
    }
    return (amount / 100).toFixed(2) + ' ' + currency;
}

export const formatBillingCycle = (billingCycle) => {
    if (billingCycle === 'YEARLY') {
        return 'year'
    }
    return 'mo'
}