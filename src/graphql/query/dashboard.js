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
    status
    documents {
      title
      filePath
    }
  }
}
`

const NAVNOTIFICATION = gql`
  query Query {
    getNotificationCount
  }
`
export {
    NAVUSERDATA,
    NAVNOTIFICATION
}