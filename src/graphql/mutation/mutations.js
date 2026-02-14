import { gql } from "@apollo/client";

const CREATE_VIN_PASSPORT = gql`
  mutation CreateVinPassport($input: CreateVinPassportInput!) {
    createVinPassport(input: $input) {
      id
    }
  }
`;
const CREATE_DOCUMENT = gql`
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
    }
  }
`;

const UPLOAD_DOC = gql`
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
    }
  }
`;
const UPLOAD_DOCUMENT = gql`
  mutation UploadDocument($input: UpdateDocumentInput!) {
    uploadDocument(input: $input) {
      id
    }
  }
`;

const DELETE_DOCUMENTS = gql`
  mutation DeleteDocument($deleteDocumentId: ID!) {
    deleteDocument(id: $deleteDocumentId)
  }
`;
const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($userId: ID!) {
    markNotificationAsRead(id: $userId)
  }
`;
const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;

const VERIFY_PASSWORD_RESET_OTP = gql`
  mutation VerifyPasswordResetOTP($email: String!, $otp: String!) {
    verifyPasswordResetOTP(email: $email, otp: $otp) {
      success
      message
      resetToken
    }
  }
`;

const RESET_PASSWORD_WITH_TOKEN = gql`
  mutation ResetPasswordWithToken($resetToken: String!, $newPassword: String!) {
    resetPasswordWithToken(resetToken: $resetToken, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export {
  CREATE_VIN_PASSPORT,
  CREATE_DOCUMENT,
  UPLOAD_DOC,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENTS,
  MARK_NOTIFICATION_AS_READ,
  REQUEST_PASSWORD_RESET,
  VERIFY_PASSWORD_RESET_OTP,
  RESET_PASSWORD_WITH_TOKEN,
};
