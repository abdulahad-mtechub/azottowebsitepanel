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
export {
    ME,
}
