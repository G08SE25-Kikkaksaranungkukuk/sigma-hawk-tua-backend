import { validateRegisterInput } from '../../apps/utils/RegisterValidation';

describe('validateRegisterInput', () => {
	test('returns true for valid phone, email, and strong password', () => {
		const result = validateRegisterInput('0123456789', 'user@example.com', 'Aa1@abcd');
		expect(result).toEqual({ isValid: true });
	});

	test('returns false for invalid phone number', () => {
		const result = validateRegisterInput('123', 'user@example.com', 'Aa1@abcd');
		expect(result).toEqual({ isValid: false });
	});

	test('returns false for invalid email', () => {
		const result = validateRegisterInput('0123456789', 'not-an-email', 'Aa1@abcd');
		expect(result).toEqual({ isValid: false });
	});

	test('returns false for weak password', () => {
		const result = validateRegisterInput('0123456789', 'user@example.com', 'password');
		expect(result).toEqual({ isValid: false });
	});
});

