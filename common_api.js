import {redirect, RedirectType} from "next/navigation";

export function getWhatsAppUrl() {
    return 'https://wa.me'
}

export function getQrcnUrl() {
    return process.env.NEXT_PUBLIC_QRCN_URL;
}

export function productDomain() {
    return 'QR_CENTRAAL'
}

export async function handleApi(ctx, promise) {
    try {
        return await promise;
    } catch (error) {
        return await handleError(ctx, error);
    }
}

export async function handleError(ctx, error) {
    console.log("I'm here: ", ctx, error)

    const isServer = typeof window === 'undefined';
    const currentPath = ctx?.resolvedUrl || '';

    const callbackParam = currentPath ? `?callback_url=${encodeURIComponent(currentPath)}` : '';
    const destination = (path) => `${path}${callbackParam}`;

    const status = error?.status;

    if (!status) {
        // Handle ETIMEDOUT, ECONNREFUSED, etc.
        const code = error?.code;
        if (code === 'ETIMEDOUT' || code === 'ECONNREFUSED') {
            if (isServer) {
                return {
                    redirect: {
                        destination: destination('/500'),
                        permanent: false
                    }
                };
            } else {
                await redirect(destination('/500'));
                return null;
            }
        }

        // Catch-all for unknown errors with no status
        console.error('Unhandled network error:', error);
        return {
            redirect: {
                destination: destination('/500'),
                permanent: false
            }
        };
    }

    switch (status) {
        case 400:
            throw error; // Let the component handle it
        case 401:
            if (isServer) {
                return {
                    redirect: {
                        destination: destination('/login'),
                        permanent: false
                    }
                };
            } else {
                await redirect(destination('/login'));
                return
            }
        case 403:
            throw error;
        case 404:
            throw error;
        case 409:
            throw error;
        case 500:
            throw error
        default:
            if (isServer) {
                return {
                    redirect: {
                        destination: destination('/500'),
                        permanent: false
                    }
                };
            } else {
                redirect(destination('/500'));
            }
    }
}

const useRedirect = (ctx, path) => {
    const isServer = typeof window === 'undefined';

    const currentPath = ctx?.resolvedUrl || '';

    const callbackParam = currentPath ? `?callback_url=${encodeURIComponent(currentPath)}` : '';
    const destination = `${path}${callbackParam}`;

    if (!isServer) {
        redirect(destination, RedirectType.replace);
        return null;
    }

    return {
        redirect: {
            destination,
            permanent: false
        }
    };
}

export function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        // Clipboard API not available, fallback below
        return fallbackCopyTextToClipboard(text);
    }
    return navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Copied to clipboard successfully!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        console.log(successful ? 'Fallback: Copying text command was successful' : 'Fallback: Copying text command was unsuccessful');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
