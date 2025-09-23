import { gql } from "@apollo/client";

const SENTMEETINGS = gql`
query GetMySentMeetingRequests($search: String, $isBuyer: Boolean) {
  getMySentMeetingRequests(search: $search, isBuyer: $isBuyer) {
    id
    createdAt
    createdBy
    requestedDate
    requestedEndDate
    receiverAvailabilityDate
    requestedTo {
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
query GetReceivedMeetingRequests($search: String, $isBuyer: Boolean) {
  getReceivedMeetingRequests(search: $search, isBuyer: $isBuyer) {
    id
    createdAt
    requestedDate
    requestedEndDate
    receiverAvailabilityDate
    requestedTo {
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
query GetMeetingsReadyForScheduling($search: String, $isBuyer: Boolean) {
  getMeetingsReadyForScheduling(search: $search, isBuyer: $isBuyer) {
    id
    createdAt
    requestedDate
    receiverAvailabilityDate
    requestedTo {
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
query GetScheduledMeetings($search: String, $isBuyer: Boolean) {
  getScheduledMeetings(search: $search, isBuyer: $isBuyer) {
    id
    createdAt
    requestedDate
    receiverAvailabilityDate
    status
    requestedTo {
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
