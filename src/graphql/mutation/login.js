import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      token
      user {
        id
        status
      }
    }
  }
`

export const UPDATE_USER = gql`
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
  }
}
`

export const LOGIN = gql`
  mutation Login($password: String!, $email: String) {
    login(password: $password, email: $email) {
      token
      user {
        id
        status
      }
    }
  }
`

export const LOGOUT = gql`
    mutation Logout {
  logout {
    message
  }
}
`

export const CHANGE_PASSWORD = gql`
mutation AdminChangePassword($adminChangePasswordId: ID, $oldPassword: String, $newPassword: String) {
  adminChangePassword(id: $adminChangePasswordId, oldPassword: $oldPassword, newPassword: $newPassword)
}
`