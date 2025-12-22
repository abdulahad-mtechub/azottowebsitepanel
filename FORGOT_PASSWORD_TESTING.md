# Forgot Password Flow - Frontend Testing Guide

## Overview

The forgot password feature has been successfully implemented with **two-step OTP verification** using the Authentica API integration. This enhanced security flow separates OTP verification from password reset.

## Security Architecture

### Two-Step Process

1. **Step 1**: Request OTP → Verify OTP → Get Reset Token (15-min expiry)
2. **Step 2**: Use Reset Token to change password

This architecture ensures:

- ✅ OTP verification is separated from password change
- ✅ Short-lived tokens (15 minutes) for security
- ✅ One-time use tokens
- ✅ Token purpose verification

## Implementation Details

### Files Modified

1. **`src/pages/ForgotPassword.jsx`**

   - Integrated GraphQL mutations for two-step password reset
   - Implemented 3-step wizard flow: Request OTP → Verify OTP → Reset Password
   - Added reset token management (stored in state)
   - Added email masking for privacy
   - Enhanced error handling with token expiry detection
   - Added loading states for all API calls

2. **`src/graphql/mutation/mutations.js`**

   - Added `REQUEST_PASSWORD_RESET` mutation
   - Added `VERIFY_PASSWORD_RESET_OTP` mutation (returns resetToken)
   - Added `RESET_PASSWORD_WITH_TOKEN` mutation
   - Removed old `RESET_PASSWORD_WITH_OTP` mutation

3. **`src/locales/en/translation.json`** & **`src/locales/ar/translation.json`**
   - Added new translation keys for enhanced messages

## User Flow

### Step 1: Request OTP

1. User navigates to `/forgotpass`
2. Enters their email address
3. Clicks "Send OTP" button
4. System calls `requestPasswordReset` mutation
5. Success message: "OTP has been sent to your email address."

### Step 2: Verify OTP & Get Reset Token

1. User receives 6-digit OTP in their email
2. Enters the OTP code
3. Clicks "Verify OTP" button
4. System calls `verifyPasswordResetOTP` mutation
5. Backend verifies OTP and returns a reset token
6. Success message: "OTP verified successfully. You may now reset your password."
7. User proceeds to password reset step

### Step 3: Reset Password with Token

1. User enters new password
2. Confirms new password
3. Clicks "Reset Password" button
4. System calls `resetPasswordWithToken` mutation with the token
5. Success message: "Password has been reset successfully."
6. Auto-redirects to login page after 1.5 seconds

## GraphQL Mutations

### 1. Request Password Reset OTP

```graphql
mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email) {
    success
    message
  }
}
```

### 2. Verify OTP and Get Reset Token

```graphql
mutation VerifyPasswordResetOTP($email: String!, $otp: String!) {
  verifyPasswordResetOTP(email: $email, otp: $otp) {
    success
    message
    resetToken
  }
}
```

**Response includes:**

- `success`: Boolean indicating verification status
- `message`: User-friendly message
- `resetToken`: JWT token valid for 15 minutes (null if verification fails)

### 3. Reset Password with Token

```graphql
mutation ResetPasswordWithToken($resetToken: String!, $newPassword: String!) {
  resetPasswordWithToken(resetToken: $resetToken, newPassword: $newPassword) {
    success
    message
  }
}
```

## Testing Instructions

### Prerequisites

- Backend server running with Authentica API configured
- Valid user email in the database
- `AUTHENTICA_API_KEY` set in backend `.env` file

### Manual Testing Steps

#### Test Case 1: Successful Password Reset Flow

1. Go to `http://localhost:5173/forgotpass`
2. Enter a valid email (e.g., `user@example.com`)
3. Click "Send OTP"
4. ✅ Verify success message appears
5. Check your email inbox for OTP
6. Enter the 6-digit OTP code
7. Click "Verify OTP"
8. ✅ Verify you're moved to password reset screen
9. Enter new password: `NewPassword123!`
10. Confirm password: `NewPassword123!`
11. Click "Reset Password"
12. ✅ Verify success message appears
13. ✅ Verify auto-redirect to login page
14. Login with new password
15. ✅ Verify login successful

#### Test Case 2: Invalid Email

1. Go to forgot password page
2. Enter non-existent email: `invalid@nonexistent.com`
3. Click "Send OTP"
4. ✅ Still shows success message (security feature)
5. ✅ No OTP received in email

#### Test Case 3: Invalid OTP

1. Request OTP with valid email
2. Enter incorrect OTP: `000000`
3. Click "Verify OTP"
4. ✅ Error message appears: "Invalid or expired OTP. Please try again."
5. ✅ User stays on OTP screen to retry
6. Enter correct OTP
7. ✅ Verification succeeds and moves to password reset

#### Test Case 4: Expired Reset Token

1. Complete OTP verification successfully
2. Wait for 16 minutes (token expires in 15 minutes)
3. Enter new password
4. Click "Reset Password"
5. ✅ Error message appears about expired token
6. ✅ Auto-redirects back to email input after 2 seconds
7. ✅ Form is reset, user must start over

#### Test Case 5: Password Validation

1. Complete OTP verification
2. Enter weak password: `weak`
3. ✅ Verify validation error appears
4. Enter strong password but different confirmation
5. ✅ Verify "passwords do not match" error
6. Enter matching strong password
7. ✅ Verify submission succeeds

#### Test Case 6: Resend OTP

1. Request OTP
2. Wait on OTP screen
3. Click "Resend" link
4. ✅ Verify new success message
5. ✅ Check email for new OTP
6. Use new OTP to continue

#### Test Case 7: Back Navigation

1. Request OTP
2. Click back arrow on OTP screen
3. ✅ Verify you're back at email input
4. ✅ Email field is cleared
5. On password reset screen, click back
6. ✅ Verify you're back at OTP screen

### Arabic Language Testing

1. Switch language to Arabic
2. Go to forgot password page
3. ✅ Verify all text is in Arabic
4. ✅ Verify RTL layout is correct
5. Complete full flow in Arabic

## Features

### Security Features

- ✅ **Two-step verification**: OTP verification returns a reset token
- ✅ **Short-lived tokens**: Reset token expires in 15 minutes
- ✅ **Email masking** (shows as `abc***d@gmail.com`)
- ✅ **Generic success messages** (prevents email enumeration)
- ✅ **OTP verification via Authentica API**
- ✅ **Password strength validation** (8+ chars, uppercase, number, special char)
- ✅ **Password confirmation matching**
- ✅ **Token purpose verification** on backend
- ✅ **One-time use tokens**

### UX Features

- ✅ 3-step wizard with back navigation
- ✅ Loading states on all buttons (request, verify, reset)
- ✅ Success/error toast messages
- ✅ Auto-redirect after successful reset
- ✅ Auto-redirect to email step if token expires
- ✅ Resend OTP functionality
- ✅ Real-time form validation
- ✅ Bilingual support (English/Arabic)
- ✅ Responsive design

## GraphQL Mutations

### Request Password Reset

```graphql
mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email) {
    success
    message
  }
}
```

### Reset Password with OTP

```graphql
mutation ResetPasswordWithEmailOTP(
  $email: String!
  $otp: String!
  $newPassword: String!
) {
  resetPasswordWithEmailOTP(
    email: $email
    otp: $otp
    newPassword: $newPassword
  ) {
    success
    message
  }
}
```

## Error Handling

| Error Scenario      | User Experience                                                   |
| ------------------- | ----------------------------------------------------------------- |
| Network error       | "Failed to send OTP. Please try again."                           |
| Invalid OTP         | "Invalid or expired OTP. Please try again." → Stays on OTP screen |
| Expired reset token | Error message → Returns to email step after 2s                    |
| Password mismatch   | "The password that you entered do not match!"                     |
| Weak password       | "Password should contain at least 8 characters..."                |
| API error           | Displays backend error message                                    |

## Translation Keys Added

### English (`en/translation.json`)

- `"OTP verified successfully. You may now reset your password."`
- `"Invalid or expired OTP. Please try again."`
- (All other keys from previous implementation)

### Arabic (`ar/translation.json`)

- `"OTP verified successfully. You may now reset your password.": "تم التحقق من رمز OTP بنجاح. يمكنك الآن إعادة تعيين كلمة المرور."`
- `"Invalid or expired OTP. Please try again.": "رمز OTP غير صالح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى."`
- (All other corresponding Arabic translations)

## State Management

The component maintains the following state:

- `emailValue`: User's email address
- `maskedEmail`: Privacy-protected email display (e.g., `abc***d@example.com`)
- `resetToken`: JWT token from OTP verification (15-min expiry)
- `requestState`: Current step (`request` | `otp` | `reset`)

**Critical**: The reset token is stored in component state and passed to the password reset mutation. It expires in 15 minutes.

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- Reset token expiration time is 15 minutes (controlled by backend)
- OTP expiration time is controlled by Authentica API (backend)
- Rate limiting is handled on backend
- Email delivery depends on Authentica service availability
- Reset token is stored in component state (cleared on page refresh)

## Troubleshooting

### OTP Not Received

1. Check spam/junk folder
2. Verify email is correct
3. Check backend logs for Authentica API errors
4. Verify `AUTHENTICA_API_KEY` is configured

### "Token Expired" Error

1. Verify less than 15 minutes passed since OTP verification
2. If expired, user must restart from email step
3. Check backend logs for token verification errors

### Form Not Submitting

1. Check browser console for errors
2. Verify GraphQL endpoint is accessible
3. Check network tab for failed requests
4. Ensure all required fields are filled

### Styling Issues

1. Clear browser cache
2. Check CSS is loading correctly
3. Verify Ant Design styles are imported

## Success Criteria

✅ User can request OTP with valid email  
✅ OTP is received in email  
✅ User can verify OTP  
✅ Reset token is received after OTP verification  
✅ User can reset password with valid token  
✅ New password works for login  
✅ Invalid OTP is rejected gracefully  
✅ Expired token is detected and user redirected  
✅ All error cases handled gracefully  
✅ Arabic translation works correctly  
✅ Loading states display properly  
✅ Auto-redirect works after success

## Backend Integration

This implementation matches the backend API exactly as specified:

### Mutations Used:

1. `requestPasswordReset(email)` → Returns success/message
2. `verifyPasswordResetOTP(email, otp)` → Returns success/message/resetToken
3. `resetPasswordWithToken(resetToken, newPassword)` → Returns success/message

### Security Features Match:

- ✅ Two-step verification process
- ✅ 15-minute token expiry
- ✅ Email enumeration prevention
- ✅ Token purpose verification
- ✅ One-time use tokens

## Next Steps (Optional Enhancements)

- [ ] Add countdown timer showing token expiry (15 minutes)
- [ ] Add OTP resend cooldown timer (e.g., "Resend available in 60s")
- [ ] Add captcha for additional security
- [ ] Show password strength indicator
- [ ] Add "show password" toggle
- [ ] Track failed OTP attempts
- [ ] Persist reset token in sessionStorage (survives refresh)

---

**Implementation Date:** December 1, 2025  
**Status:** ✅ Complete and Ready for Testing  
**Backend API Version:** Two-step verification with 15-minute token expiry
