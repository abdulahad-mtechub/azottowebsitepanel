import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      token
      refreshToken
      user {
        id
        status
      }
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($email: String!) {
    verifyEmail(email: $email)
  }
`;

export const VERIFY_EMAIL_OTP = gql`
  mutation VerifyEmailOTP($email: String!, $otp: String!) {
    verifyEmailOTP(email: $email, otp: $otp) {
      message
      success
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
    }
  }
`;

export const LOGIN = gql`
  mutation Login($password: String!, $email: String) {
    login(password: $password, email: $email) {
      token
      refreshToken
      user {
        id
        status
      }
    }
  }
`;

export const CONNECTWALLET = gql`
mutation ConnectWallet($walletAddress: String!, $signature: String) {
  connectWallet(walletAddress: $walletAddress, signature: $signature) {
    user {
      id
    }
    token
  }
}
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      refreshToken
      user {
        id
        status
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation AdminChangePassword(
    $adminChangePasswordId: ID
    $oldPassword: String
    $newPassword: String
  ) {
    adminChangePassword(
      id: $adminChangePasswordId
      oldPassword: $oldPassword
      newPassword: $newPassword
    )
  }
`;
