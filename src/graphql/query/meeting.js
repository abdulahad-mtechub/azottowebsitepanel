import { gql } from "@apollo/client";

const SENTMEETINGS = gql`
query GetMySentMeetingRequests($search: String) {
  getMySentMeetingRequests(search: $search) {
    id
    createdAt
    requestedBy {
      name
    }
    business {
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`
const RECEIVEDMEETINGS = gql`
query GetReceivedMeetingRequests($search: String) {
  getReceivedMeetingRequests(search: $search) {
    id
    createdAt
    requestedBy {
      name
    }
    business {
      id
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`


const READYSCHEDULEDMEETINGS = gql`
query GetMeetingsReadyForScheduling($search: String) {
  getMeetingsReadyForScheduling(search: $search) {
    id
    createdAt
    requestedDate
    ownerAvailabilityDate
    requestedBy {
      name
    }
    business {
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`
const SCHEDULEDMEETINGS = gql`
query GetScheduledMeetings($search: String) {
  getScheduledMeetings(search: $search) {
    id
    createdAt
    requestedDate
    ownerAvailabilityDate
    status
    requestedBy {
      name
    }
    business {
      businessTitle
      price
    }
    offer {
      id
      price
    }
  }
}
`

const GETMEETINGS = gql`
query GetMeetings($getMeetingsId: ID!, $filter: MeetingFilterType, $search: String, $limit: Int, $offset: Int) {
  getMeetings(id: $getMeetingsId, filter: $filter, search: $search, limit: $limit, offset: $offset) {
    totalCount
  }
}`

const GETBUYERMEETINGCOUNT = gql`
query Query {
  getBuyerCount
}
  `

const GETSELLERMEETINGCOUNT = gql`
query Query {
  getSellerCount
}
  `
export {
    SENTMEETINGS,
    RECEIVEDMEETINGS,
    READYSCHEDULEDMEETINGS,
    SCHEDULEDMEETINGS,
    GETMEETINGS,
    GETBUYERMEETINGCOUNT,
    GETSELLERMEETINGCOUNT
}
