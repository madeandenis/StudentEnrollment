export const validators = {

    required: (value: any, message: string = 'Acest câmp este obligatoriu') => {
        const isEmpty = value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0);
        return isEmpty ? message : null;
    },

    email: (value: string) => {
        if (!value) return 'Email-ul este obligatoriu';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Email-ul nu este valid';
        }
        return null;
    },

    password: (value: string) => {
        if (!value) return 'Parola este obligatorie';
        if (value.length < 8) {
            return 'Parola trebuie să aibă minim 8 caractere';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Parola trebuie să conțină cel puțin o literă mare';
        }
        if (!/[a-z]/.test(value)) {
            return 'Parola trebuie să conțină cel puțin o literă mică';
        }
        if (!/[0-9]/.test(value)) {
            return 'Parola trebuie să conțină cel puțin o cifră';
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
            return 'Parola trebuie să conțină cel puțin un caracter special';
        }
        const uniqueChars = new Set(value).size;
        if (uniqueChars < 4) {
            return 'Parola trebuie să conțină cel puțin 4 caractere unice';
        }
        return null;
    },

    confirmPassword: (value: string, values: { password: string }) => {
        if (!value) return 'Confirmarea parolei este obligatorie';
        if (value !== values.password) {
            return 'Parolele nu se potrivesc';
        }
        return null;
    },
};