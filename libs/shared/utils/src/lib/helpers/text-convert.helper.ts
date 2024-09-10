export function convertCamelcaseToUnderscore(key: string) {
    return key.replace(/\.?([A-Z])/g, (x, y) => "_" + y.toLowerCase()).replace(/^_/, "");
}

export function convertUnderscoreToCamelcase(key: string) {
    return key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    // return key.replace(/_(\w)/g, (m, n) =>  n ? n.toUpperCase() : "");
}
