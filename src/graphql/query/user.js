import { gql } from "@apollo/client";

const ME = gql`
  query GetUser($getUserId: ID!) {
  getUser(id: $getUserId) {
    id
    name
    role
    email
    createdAt
    walletAddress
  }
}
`
const NOTIFICATION = gql`
  query GetNotifications($userId: ID!, $limit: Int, $offSet: Int) {
    getNotifications(userId: $userId, limit: $limit, offSet: $offSet) {
      count
      notifications {
        id
        createdAt
        isRead
        name
        message
        user {
          id
          name
        }
      }
    }
  }
`
export {
    ME,
    NOTIFICATION,
}
