export function mapProjectTypeToResourceUrl(projectType) {
    if (projectType === 'BusinessCard') {
        return 'dashboard/business-cards'
    } else if (projectType === 'UniText') {
        return 'dashboard/uni-texts'
    } else if (projectType === 'Campaign') {
        return 'dashboard/campaigns'
    } else if (projectType === 'OnePage') {
        return 'dashboard/one-pages'
    } else if (projectType === 'RestaurantMenu') {
        return 'dashboard/restaurants'
    }
    return ''
}

export function hasValue(v) {
    if (v === null) {
        return false
    }
    if (v === undefined) {
        return false
    }

    if (typeof v === 'string'
        || v instanceof String) {
        return v.trim() !== ''
    }

    return true
}

function formatDuration(seconds) {
    const days = Math.floor(seconds / 86_400);      // 60 s × 60 m × 24 h
    seconds %= 86_400;

    const hours = Math.floor(seconds / 3_600);       // 60 s × 60 m
    seconds %= 3_600;

    const minutes = Math.floor(seconds / 60);
    const secs = +(seconds % 60).toFixed(1);        // keep the decimal part

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

export function prettifyDuration(seconds) {
    const parts = formatDuration(seconds).split(' ');
    return parts.filter(p => !p.startsWith('0d') &&
        !p.startsWith('0h') &&
        !p.startsWith('0m')).join(' ');
}
