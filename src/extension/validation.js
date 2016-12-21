export function isValidExtensionName(name) {
    return /^[a-z]+[a-z0-9\-]*$/.test(name);
}
