import { useState, useCallback } from 'react';

interface UsePasswordGeneratorOptions {
    length?: number;
    includeLowercase?: boolean;
    includeUppercase?: boolean;
    includeNumbers?: boolean;
    includeSpecialChars?: boolean;
}

interface UsePasswordGeneratorReturn {
    password: string;
    generatePassword: (customLength?: number) => string;
    isValid: boolean;
}


const randomInt = (max: number) => {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
};

const pick = (s: string) => s[randomInt(s.length)];

const shuffle = (arr: string[]) => {
    // Fisher–Yates
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const usePasswordGenerator = (
    options: UsePasswordGeneratorOptions = {}
): UsePasswordGeneratorReturn => {
    const {
        length = 12,
        includeLowercase = true,
        includeUppercase = true,
        includeNumbers = true,
        includeSpecialChars = true,
    } = options;

    const [password, setPassword] = useState<string>('');

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '@$!%*?&_-#';

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

    const validatePassword = useCallback((pwd: string): boolean => {
        return passwordRegex.test(pwd);
    }, []);


    // Pure function (NOT a hook, safe recursion)
    const generatePasswordInternal = (finalLength: number): string => {
        let charset = '';

        if (includeLowercase) charset += lowercase;
        if (includeUppercase) charset += uppercase;
        if (includeNumbers) charset += numbers;
        if (includeSpecialChars) charset += specialChars;

        if (charset === '') {
            console.error('Devi includere almeno un tipo di carattere');
            return '';
        }

        const requiredChars: string[] = [];

        if (includeLowercase) requiredChars.push(pick(lowercase));
        if (includeUppercase) requiredChars.push(pick(uppercase));
        if (includeNumbers) requiredChars.push(pick(numbers));
        if (includeSpecialChars) requiredChars.push(pick(specialChars));

        for (let i = requiredChars.length; i < finalLength; i++) {
            requiredChars.push(pick(charset));
        }

        const generated = shuffle(requiredChars).join('');

        // recursion happens here safely
        if (!validatePassword(generated)) {
            return generatePasswordInternal(finalLength);
        }

        return generated;
    };

    const generatePassword = (customLength?: number): string => {
        const finalLength = customLength || length;

        if (finalLength < 8) {
            console.warn('La lunghezza minima della password è 8 caratteri');
            return '';
        }

        const newPassword = generatePasswordInternal(finalLength);
        setPassword(newPassword);
        return newPassword;
    };

    return {
        password,
        generatePassword,
        isValid: validatePassword(password),
    };
};

export default usePasswordGenerator;