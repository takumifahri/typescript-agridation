"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordDebugger = void 0;
exports.validatePasswordWithDiagnostics = validatePasswordWithDiagnostics;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordDebugger {
    /**
     * Diagnose password hashing and comparison issues
     * @param plainPassword Plain text password
     * @param storedHash Stored hashed password
     */
    static diagnosePasswordIssue(plainPassword, storedHash) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const isMatch = yield bcryptjs_1.default.compare(plainPassword, storedHash);
                console.log('Bcrypt Compare Result:', isMatch);
                // Additional diagnostic steps
                if (!isMatch) {
                    // Try manual verification techniques
                    console.log('--- ADVANCED DIAGNOSIS ---');
                    // Check for potential encoding or whitespace issues
                    const trimmedPlainPassword = plainPassword.trim();
                    console.log('Trimmed Password:', trimmedPlainPassword);
                    const altMatch = yield bcryptjs_1.default.compare(trimmedPlainPassword, storedHash);
                    console.log('Trimmed Password Match:', altMatch);
                    // Check for any strange characters
                    console.log('Plain Password Char Codes:', Array.from(plainPassword).map(char => char.charCodeAt(0)));
                }
                return {
                    isValidHash: isValidBcryptHash,
                    isMatch,
                    plainPasswordLength: plainPassword.length,
                    hashLength: storedHash.length
                };
            }
            catch (error) {
                console.error('Password Diagnosis Error:', error);
                return {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    isMatch: false
                };
            }
        });
    }
    /**
     * Generate a hash with detailed logging
     * @param password Plain text password
     * @param saltRounds Number of salt rounds
     */
    static generateHashWithLogging(password_1) {
        return __awaiter(this, arguments, void 0, function* (password, saltRounds = 12) {
            console.log('=== HASH GENERATION DIAGNOSIS ===');
            console.log('Input Password:', password);
            console.log('Salt Rounds:', saltRounds);
            try {
                // Generate hash
                const hash = yield bcryptjs_1.default.hash(password, saltRounds);
                console.log('Generated Hash:', hash);
                console.log('Hash Length:', hash.length);
                console.log('Hash Starts With:', hash.substring(0, 20));
                // Verify immediately
                const verificationResult = yield bcryptjs_1.default.compare(password, hash);
                console.log('Immediate Verification:', verificationResult);
                return {
                    hash,
                    length: hash.length,
                    verified: verificationResult
                };
            }
            catch (error) {
                console.error('Hash Generation Error:', error);
                return {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    hash: null
                };
            }
        });
    }
}
exports.PasswordDebugger = PasswordDebugger;
// Utility function to help in controllers
function validatePasswordWithDiagnostics(plainPassword, storedHash) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Password Validation Attempt');
        // Log input details
        console.log('Input Password:', plainPassword);
        console.log('Stored Hash:', storedHash);
        try {
            // Perform comparison
            const isValid = yield bcryptjs_1.default.compare(plainPassword, storedHash);
            // Detailed logging
            console.log('Validation Result:', isValid);
            // If not valid, run comprehensive diagnosis
            if (!isValid) {
                yield PasswordDebugger.diagnosePasswordIssue(plainPassword, storedHash);
            }
            return isValid;
        }
        catch (error) {
            console.error('Validation Error:', error);
            return false;
        }
    });
}
