export function formatProductTitle(name) {
    if (name.length <= 30) {
        return name;
    }
    return name.substring(0, 27) + '...'
}
