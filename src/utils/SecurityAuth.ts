import bcrypt from 'bcryptjs';

export class PasswordDebugger {
    /**
     * Diagnose password hashing and comparison issues
     * @param plainPassword Plain text password
     * @param storedHash Stored hashed password
     */
    static async diagnosePasswordIssue(plainPassword: string, storedHash: string) {
        console.log('=== COMPREHENSIVE PASSWORD DIAGNOSIS ===');
        console.log('Plain Password:', plainPassword);
        console.log('Stored Hash:', storedHash);

        try {
            // Validate hash format
            const isValidBcryptHash = /^\$2[aby]\$\d{2}\$/.test(storedHash);
            console.log('Is Valid Bcrypt Hash Format:', isValidBcryptHash);

            // Detailed hash information
            console.log('Hash Details:', {
                plainPasswordLength: plainPassword.length,
                storedHashLength: storedHash.length,
                hashFirstChars: storedHash.substring(0, 20),
            });

            // Attempt comparison
            const isMatch = await bcrypt.compare(plainPassword, storedHash);
            console.log('Bcrypt Compare Result:', isMatch);

            // Additional diagnostic steps
            if (!isMatch) {
                // Try manual verification techniques
                console.log('--- ADVANCED DIAGNOSIS ---');
                
                // Check for potential encoding or whitespace issues
                const trimmedPlainPassword = plainPassword.trim();
                console.log('Trimmed Password:', trimmedPlainPassword);
                
                const altMatch = await bcrypt.compare(trimmedPlainPassword, storedHash);
                console.log('Trimmed Password Match:', altMatch);

                // Check for any strange characters
                console.log('Plain Password Char Codes:', 
                    Array.from(plainPassword).map(char => char.charCodeAt(0))
                );
            }

            return {
                isValidHash: isValidBcryptHash,
                isMatch,
                plainPasswordLength: plainPassword.length,
                hashLength: storedHash.length
            };
        } catch (error) {
            console.error('Password Diagnosis Error:', error);
            return {
                error: error instanceof Error ? error.message : 'Unknown error',
                isMatch: false
            };
        }
    }

    /**
     * Generate a hash with detailed logging
     * @param password Plain text password
     * @param saltRounds Number of salt rounds
     */
    static async generateHashWithLogging(password: string, saltRounds: number = 12) {
        console.log('=== HASH GENERATION DIAGNOSIS ===');
        console.log('Input Password:', password);
        console.log('Salt Rounds:', saltRounds);

        try {
            // Generate hash
            const hash = await bcrypt.hash(password, saltRounds);

            console.log('Generated Hash:', hash);
            console.log('Hash Length:', hash.length);
            console.log('Hash Starts With:', hash.substring(0, 20));

            // Verify immediately
            const verificationResult = await bcrypt.compare(password, hash);
            console.log('Immediate Verification:', verificationResult);

            return {
                hash,
                length: hash.length,
                verified: verificationResult
            };
        } catch (error) {
            console.error('Hash Generation Error:', error);
            return {
                error: error instanceof Error ? error.message : 'Unknown error',
                hash: null
            };
        }
    }
}

// Utility function to help in controllers
export async function validatePasswordWithDiagnostics(
    plainPassword: string, 
    storedHash: string
) {
    console.log('Password Validation Attempt');
    
    // Log input details
    console.log('Input Password:', plainPassword);
    console.log('Stored Hash:', storedHash);

    try {
        // Perform comparison
        const isValid = await bcrypt.compare(plainPassword, storedHash);
        
        // Detailed logging
        console.log('Validation Result:', isValid);

        // If not valid, run comprehensive diagnosis
        if (!isValid) {
            await PasswordDebugger.diagnosePasswordIssue(
                plainPassword, 
                storedHash
            );
        }

        return isValid;
    } catch (error) {
        console.error('Validation Error:', error);
        return false;
    }
}