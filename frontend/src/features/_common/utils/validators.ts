export const validators = {
  required: (value: any, message: string = "Acest câmp este obligatoriu") => {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim().length === 0);
    return isEmpty ? message : null;
  },

  email: (value: string) => {
    if (!value) return "Email-ul este obligatoriu";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Email-ul nu este valid";
    }
    return null;
  },

  password: (value: string) => {
    if (!value) return "Parola este obligatorie";
    if (value.length < 8) {
      return "Parola trebuie să aibă minim 8 caractere";
    }
    if (!/[A-Z]/.test(value)) {
      return "Parola trebuie să conțină cel puțin o literă mare";
    }
    if (!/[a-z]/.test(value)) {
      return "Parola trebuie să conțină cel puțin o literă mică";
    }
    if (!/[0-9]/.test(value)) {
      return "Parola trebuie să conțină cel puțin o cifră";
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Parola trebuie să conțină cel puțin un caracter special";
    }
    const uniqueChars = new Set(value).size;
    if (uniqueChars < 4) {
      return "Parola trebuie să conțină cel puțin 4 caractere unice";
    }
    return null;
  },

  confirmPassword: (value: string, values: { password: string }) => {
    if (!value) return "Confirmarea parolei este obligatorie";
    if (value !== values.password) {
      return "Parolele nu se potrivesc";
    }
    return null;
  },

  // CNP Validator
  cnp: (value: string) => {
    if (!value) return "CNP-ul este obligatoriu";
    if (value.length !== 13) {
      return "CNP-ul trebuie să conțină exact 13 cifre";
    }
    if (!/^\d{13}$/.test(value)) {
      return "CNP-ul trebuie să conțină doar cifre";
    }

    // Validate CNP structure (date and county)
    const digits = value.split("").map(Number);

    // Check date validity
    const year = digits[1] * 10 + digits[2];
    const month = digits[3] * 10 + digits[4];
    const day = digits[5] * 10 + digits[6];
    const s = digits[0];

    let fullYear: number;
    switch (s) {
      case 1:
      case 2:
        fullYear = 1900 + year;
        break;
      case 3:
      case 4:
        fullYear = 1800 + year;
        break;
      case 5:
      case 6:
        fullYear = 2000 + year;
        break;
      case 7:
      case 8:
      case 9:
        const currentYearShort = new Date().getFullYear() % 100;
        fullYear = year > currentYearShort ? 1900 + year : 2000 + year;
        break;
      default:
        return "CNP invalid: cifra de sex/secol invalidă";
    }

    // Validate date
    const date = new Date(fullYear, month - 1, day);
    if (
      date.getFullYear() !== fullYear ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "CNP invalid: data nașterii invalidă";
    }

    // Check county code (digits 7-8)
    const countyCode = value.substring(7, 9);
    const validCountyCodes = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "51",
      "52",
      "80",
    ];

    if (!validCountyCodes.includes(countyCode)) {
      return "CNP invalid: codul județului invalid";
    }

    // Validate checksum (control digit)
    const controlKey = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * controlKey[i];
    }
    const remainder = sum % 11;
    const expectedControl = remainder === 10 ? 1 : remainder;

    if (digits[12] !== expectedControl) {
      return "CNP invalid";
    }

    return null;
  },

  // Phone Number Validator
  phoneNumber: (value: string) => {
    if (!value) return "Numărul de telefon este obligatoriu";

    const trimmed = value.trim();

    if (trimmed.length < 10) {
      return "Numărul de telefon trebuie să aibă minim 10 caractere";
    }
    if (trimmed.length > 20) {
      return "Numărul de telefon nu poate depăși 20 de caractere";
    }

    // Matches backend regex: ^\+?[0-9\s\-()]{8,20}$
    if (!/^\+?[0-9\s\-()]{8,20}$/.test(trimmed)) {
      return "Numărul de telefon nu este valid";
    }

    return null;
  },

  // Birth Date Validator
  dateOfBirth: (value: string | Date) => {
    if (!value) return "Data nașterii este obligatorie";

    const date = typeof value === "string" ? new Date(value) : value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(date.getTime())) {
      return "Data nașterii nu este validă";
    }

    // Must be in the past
    if (date >= today) {
      return "Data nașterii trebuie să fie în trecut";
    }

    // Not more than 120 years ago
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    if (date < minDate) {
      return "Data nașterii este prea veche";
    }

    return null;
  },

  // Name Validator
  name: (value: string, fieldName: string = "Numele") => {
    if (!value) return `${fieldName} este obligatoriu`;

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return `${fieldName} trebuie să aibă cel puțin 2 caractere`;
    }
    if (trimmed.length > 35) {
      return `${fieldName} nu poate depăși 35 de caractere`;
    }

    return null;
  },

  // Postal Code Validator
  postalCode: (value: string | null) => {
    if (!value || value.trim() === "") return null;

    const trimmed = value.trim();

    if (trimmed.length > 20) {
      return "Codul poștal nu poate depăși 20 de caractere";
    }

    // Must be alphanumeric only
    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
      return "Codul poștal trebuie să conțină doar litere și cifre";
    }

    return null;
  },

  // Course Code Validator
  courseCode: (value: string) => {
    if (!value) return "Codul cursului este obligatoriu";

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return "Codul cursului trebuie să aibă cel puțin 2 caractere";
    }
    if (trimmed.length > 20) {
      return "Codul cursului nu poate depăși 20 de caractere";
    }

    return null;
  },

  // Course Name Validator
  courseName: (value: string) => {
    if (!value) return "Numele cursului este obligatoriu";

    const trimmed = value.trim();

    if (trimmed.length < 3) {
      return "Numele cursului trebuie să aibă cel puțin 3 caractere";
    }
    if (trimmed.length > 150) {
      return "Numele cursului nu poate depăși 150 de caractere";
    }

    return null;
  },

  // Course Description Validator
  courseDescription: (value: string) => {
    if (!value) return "Descrierea este obligatorie";

    const trimmed = value.trim();

    if (trimmed.length > 500) {
      return "Descrierea nu poate depăși 500 de caractere";
    }

    return null;
  },

  // Credits Validator
  credits: (value: number | null | undefined) => {
    if (!value || value < 1) {
      return "Credite trebuie să fie între 1 și 10";
    }
    if (value > 10) {
      return "Credite trebuie să fie între 1 și 10";
    }

    return null;
  },

  // Max Enrollment Validator
  maxEnrollment: (value: number | null | undefined) => {
    if (!value || value <= 0) {
      return "Numărul maxim de studenți trebuie să fie cel puțin 1";
    }
    if (value > 1000) {
      return "Numărul maxim de studenți nu poate depăși 1000";
    }

    return null;
  },
};
