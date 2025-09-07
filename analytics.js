import posthog from "posthog-js";

const event_prefix = () => {
    return 'qrnc_'
}

export const qrScanned = (id) => {
    if (posthog) {
        posthog.capture(event_prefix() + 'qr_scanned', {
            'id': id,
        })
    }
}

export const onPurchased = (id) => {
    if (posthog) {
        posthog.capture(event_prefix() + 'on_purchased', {
            'id': id,
        })
    }
}

export const onSubscribed = (id) => {
    if (posthog) {
        posthog.capture(event_prefix() + 'on_subscribed', {
            'id': id,
        })
    }
}
