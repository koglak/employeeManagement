export function formatPhone(value: string): string {
    const digits = value.replace(/\D+/g, '');
    if (digits.startsWith('90') && digits.length >= 12) {
        const rest = digits.slice(2).padEnd(10, ''); // 10 hane
        const g1 = rest.slice(0, 3), g2 = rest.slice(3, 6), g3 = rest.slice(6, 8), g4 = rest.slice(8, 10);
        return `(+90) ${g1} ${g2} ${g3} ${g4}`.trim();
    }
    if (/\(\+90\)/.test(value)) return value;
    return value;
}
