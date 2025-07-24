import { gql } from "@apollo/client";

const ME = gql`
   query GetUser($getUserId: ID!) {
  getUser(id: $getUserId) {
    id
    name
    email
    phone
  }
}
`

const NOTIFICATION = gql`
  query GetNotifications($userId: ID!) {
    getNotifications(userId: $userId) {
      id
      isRead
    }
  }
`
export {
    ME,
    NOTIFICATION
}
