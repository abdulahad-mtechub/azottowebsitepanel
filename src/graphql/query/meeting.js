import { gql } from "@apollo/client";

const SENTMEETINGS = gql`
query GetMySentMeetingRequests($search: String, $isBuyer: Boolean, $limit: Int, $offSet: Int) {
  getMySentMeetingRequests(search: $search, isBuyer: $isBuyer, limit: $limit, offSet: $offSet) {
    totalCount
    items {
      id
      createdAt
      createdBy
      requestedDate
      requestedEndDate
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
}
`
const RECEIVEDMEETINGS = gql`
query GetReceivedMeetingRequests($search: String, $isBuyer: Boolean, $limit: Int, $offSet: Int) {
  getReceivedMeetingRequests(search: $search, isBuyer: $isBuyer, limit: $limit, offSet: $offSet) {
    totalCount
    items {
      id
      createdAt
      requestedDate
      requestedEndDate
      receiverAvailabilityDate
      status
      requestedTo {
        name
      }
      requestedBy {
        name
        id
      }
      business {
        id
        businessTitle
        price
        businessStatus
      }
      offer {
        id
        price
      }
    }
  }
}
`

const READYSCHEDULEDMEETINGS = gql`
query GetMeetingsReadyForScheduling($search: String, $isBuyer: Boolean, $limit: Int, $offSet: Int) {
  getMeetingsReadyForScheduling(search: $search, isBuyer: $isBuyer, limit: $limit, offSet: $offSet) {
    totalCount
    items {
      id
      createdAt
      requestedDate
      requestedEndDate
      receiverAvailabilityDate
      status
      requestedBy {
        id
        name
      }
      requestedTo {
        name
      }
      business {
        businessTitle
        price
        seller {
          id
        }
      }
      offer {
        id
        price
      }
    }
  }
}
`
const SCHEDULEDMEETINGS = gql`
  query GetScheduledMeetings($search: String, $isBuyer: Boolean, $limit: Int, $offSet: Int) {
    getScheduledMeetings(search: $search, isBuyer: $isBuyer, limit: $limit, offSet: $offSet) {
      totalCount
      items {
        id
        createdAt
        adminAvailabilityDate
        status
        requestedTo {
          name
        }
        requestedBy {
          id
          name
        }
        business {
          businessTitle
          price
          seller {
            id
          }
        }
        meetingLink
        offer {
          id
          price
        }
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
const CHECKMEETINGEXISTS = gql`
  query Query($businessId: ID!, $buyerId: ID!) {
    checkMeetingExists(businessId: $businessId, buyerId: $buyerId)
  }
`

const REJECT_MEETING = gql`
  mutation RejectMeeting($meetingId: ID!) {
    rejectMeeting(meetingId: $meetingId)
  }
`

export {
    SENTMEETINGS,
    RECEIVEDMEETINGS,
    READYSCHEDULEDMEETINGS,
    SCHEDULEDMEETINGS,
    GETMEETINGS,
    GETBUYERMEETINGCOUNT,
    GETSELLERMEETINGCOUNT,
    CHECKMEETINGEXISTS,
    REJECT_MEETING
}