export default function generateVerificationCode() {
    const length = 6; // Specify the desired length of the verification code
    const characters = '0123456789'; // Specify the characters to be used in the verification code
    let verificationCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters[randomIndex];
    }

    return verificationCode;
}

