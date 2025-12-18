
export const Validators = {
    // --- Standard Validators ---

    required: (value) => {
        if (value === null || value === undefined || value === '') return 'This field is required.';
        if (typeof value === 'string' && value.trim() === '') return 'This field is required.';
        return null;
    },

    email: (value) => {
        if (!value) return null;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value) ? null : 'Invalid email address.';
    },

    phone: (value) => {
        if (!value) return null;
        // Basic North American phone validation (10 digits, optional separators)
        const re = /^(\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return re.test(value) ? null : 'Invalid phone number.';
    },

    integer: (value) => {
        if (!value) return null;
        const num = Number(value);
        return Number.isInteger(num) ? null : 'Must be an integer.';
    },

    positiveInteger: (value) => {
        if (!value) return null;
        const num = Number(value);
        return (Number.isInteger(num) && num > 0) ? null : 'Must be a positive integer.';
    },

    positiveIntegerOrZero: (value) => {
        if (!value) return null;
        const num = Number(value);
        return (Number.isInteger(num) && num >= 0) ? null : 'Must be a positive integer or zero.';
    },

    // --- Custom Business Validators (Ported from powdercloud.js) ---

    airTemp: (value) => {
        if (!value) return null;
        if (isNaN(value)) return 'Must be a number.';
        const parts = value.toString().split('.');
        if (parts.length > 2) return 'Invalid format.';
        if (parts.length === 2) {
            if (parts[1] !== '0' && parts[1] !== '5') return 'Must end in .0 or .5';
        }
        return null;
    },

    aspectNum: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num)) return 'Must be an integer.';
        if (num < 0 || num > 360) return 'Must be between 0 and 360.';
        return null;
    },

    avalDepthMetric: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num <= 0) return 'Must be a positive integer.';
        if (num % 25 !== 0) return 'Must be a multiple of 25.';
        return null;
    },

    avalPathRunMetric: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num <= 0) return 'Must be a positive integer.';
        if (num > 300 && num % 100 !== 0) return 'Must be a multiple of 100 (if > 300).';
        if (num % 25 !== 0) return 'Must be a multiple of 25.';
        return null;
    },

    avalSurfaceMetric: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num <= 0) return 'Must be a positive integer.';
        if (num % 10 !== 0) return 'Must be a multiple of 10.';
        return null;
    },

    barometric: (value) => {
        if (!value) return null;
        if (isNaN(value) || value <= 0) return 'Must be a positive number.';
        const parts = value.toString().split('.');
        if (parts.length === 2 && parts[1].length > 2) return 'Max 2 decimal places.';
        return null;
    },

    density: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) return 'Must be a positive integer or zero.';
        return null;
    },

    elevationMetric: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num)) return 'Must be an integer.';
        if (num < 0) return 'Too low (min 0).';
        if (num > 9000) return 'Too high (max 9000).';
        return null;
    },

    elevationValleyFogMetric: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num)) return 'Must be an integer.';
        if (num < 0 || num > 9000) return 'Must be between 0 and 9000.';
        if (num % 50 !== 0) return 'Must be a multiple of 50.';
        return null;
    },

    grainSize: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (isNaN(num) || num <= 0) return 'Must be a positive number.';
        if (num > 0.5) {
            const parts = value.toString().split('.');
            if (parts.length === 2 && parts[1] !== '0' && parts[1] !== '5') return 'Must end in .0 or .5 (if > 0.5).';
        } else {
            // <= 0.5
            if (num !== 0.1 && num !== 0.3 && num !== 0.5) return 'Must be 0.1, 0.3, or 0.5 (if <= 0.5).';
        }
        return null;
    },

    hits: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) return 'Must be a positive integer or zero.';
        if (num > 30) return 'Too high (max 30).';
        return null;
    },

    incline: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) return 'Must be a positive integer or zero.';
        if (num > 90) return 'Too high (max 90).';
        return null;
    },

    percent: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) return 'Must be a positive integer or zero.';
        if (num > 100) return 'Too high (max 100).';
        return null;
    },

    precipIntensityMetric: (value) => {
        if (!value) return null;
        if (isNaN(value) || value <= 0) return 'Must be a positive number.';
        const parts = value.toString().split('.');
        if (parts.length === 2 && parts[1].length > 1) return 'Max 1 decimal place.';
        return null;
    },

    snowFallDepth: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (isNaN(num) || num < 0) return 'Must be a positive number.';
        if (num !== 0 && num !== 0.1 && num !== 0.5 && !Number.isInteger(num)) return 'Must be integer, 0.1, or 0.5.';
        return null;
    },

    snowProThickness: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) return 'Must be a positive integer or zero.';
        if (num > 6000) return 'Too high (max 6000).';
        return null;
    },

    snowTemp: (value) => {
        if (!value) return null;
        if (isNaN(value)) return 'Must be a number.';
        const parts = value.toString().split('.');
        if (parts.length === 2) {
            if (parts[1].length > 1) return 'Max 1 decimal place.';
            const decimal = parseInt(parts[1]);
            if (![1, 2, 3, 9].includes(decimal)) return 'Decimal must be 1, 2, 3, or 9.'; // Based on legacy code logic
        }
        return null;
    },

    stabilityRatio: (value) => {
        if (!value) return null;
        if (isNaN(value) || value < 0) return 'Must be a positive number.';
        if (value > 1000) return 'Too high (max 1000).';
        const parts = value.toString().split('.');
        if (parts.length === 2 && parts[1].length > 3) return 'Max 3 decimal places.';
        return null;
    },

    windDirNum: (value) => {
        if (!value) return null;
        const num = Number(value);
        if (!Number.isInteger(num) || num < 0) return 'Must be a positive integer or zero.';
        if (num > 360) return 'Too high (max 360).';
        if (num % 10 !== 0) return 'Must be a multiple of 10.';
        return null;
    },

    windSpeed: (value) => {
        if (!value) return null;
        if (isNaN(value) || value < 0) return 'Must be a positive number.';
        if (value > 1000) return 'Too high (max 1000).';
        const parts = value.toString().split('.');
        if (parts.length === 2 && parts[1].length > 1) return 'Max 1 decimal place.';
        return null;
    }
};
