import { gql } from "@apollo/client";

const NAVUSERDATA = gql`
query GetNavUser($getNavUserId: ID!) {
  getNavUser(id: $getNavUserId) {
    id
    name
    email
    phone
    city
    district
    documents {
      title
      filePath
    }
  }
}
`

const NAVNOTIFICATION = gql`
query GetNotifications($userId: ID!) {
  getNotifications(userId: $userId) {
    count
  }
}
`
export {
    NAVUSERDATA,
    NAVNOTIFICATION
}