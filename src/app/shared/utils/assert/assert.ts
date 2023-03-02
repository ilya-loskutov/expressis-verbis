export function assert(expression: any, message?: string) {
    if (!Boolean(expression)) {
        throw new Error(message || 'unknown assertion error');
    }
}