import { gql } from "@apollo/client";

const CREATE_OFFER = gql`
  mutation CreateOffer($input: CreateOfferInput!) {
  createOffer(input: $input) {
    id
  }
}
`
const UPDATE_OFFER = gql `
mutation UpdateOfferStatus($input: UpdateOfferStatusInput!) {
  updateOfferStatus(input: $input) {
    id
  }
}
`
const CREATE_BUSINESS = gql `
  mutation CreateBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      id
    }
  } 
`
const CREATE_SAVE_BUSINESS = gql `
  mutation SaveBusiness($saveBusinessId: ID!) {
    saveBusiness(id: $saveBusinessId)
  }
`
const CREATE_VIEW_BUSINESS = gql `
  mutation ViewBusiness($viewBusinessId: ID!) {
    viewBusiness(id: $viewBusinessId)
  }
`
const ACCEPT_ENDA = gql `
  mutation AcceptEnda($input: AcceptEndaInput!) {
  acceptEnda(input: $input) {
    id
  }
}
`
const CREATE_ENDA = gql `
mutation CreateEnda($input: AcceptEndaInput!) {
  createEnda(input: $input) {
    id
  }
}
`
const BUSINESS_MEETING = gql `
  mutation RequestMeeting($input: CreateMeetingInput!) {
  requestMeeting(input: $input) {
    id
  }
}
`
const UPDATE_MEETING = gql `
mutation UpdateMeeting($input: UpdateMeetingInput!) {
  updateMeeting(input: $input) {
    id
  }
}
`
const APPROVE_MEETING = gql `
mutation ApproveMeeting($meetingId: ID!, $offerId: ID) {
  approveMeeting(meetingId: $meetingId, offerId: $offerId)
}
`
const UPLOAD_DOC = gql `
mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(input: $input) {
    id
  }
}
`
const FINALIZE_DEAL = gql `
mutation UpdateDeal($input: UpdateDealInput!) {
  updateDeal(input: $input) {
    id
  }
}
`
const UPDATE_DEAL = gql`
mutation UpdateDeal($input: UpdateDealInput!) {
  updateDeal(input: $input) {
    id
  }
}
`
const COUNTER_OFFER = gql `
mutation CounterOffer($input: CounterOfferInput!) {
  counterOffer(input: $input) {
    id
  }
}
`
const SEND_BANK = gql`
mutation SendBankToBuyer($sendBankToBuyerId: ID) {
  sendBankToBuyer(id: $sendBankToBuyerId) {
    iban
  }
}
`
const UPLOAD_DOCUMENT = gql`
mutation UploadDocument($input: UpdateDocumentInput!) {
  uploadDocument(input: $input) {
    id
  }
}
`

const DELETE_DOCUMENTS = gql`
mutation DeleteDocument($deleteDocumentId: ID!) {
  deleteDocument(id: $deleteDocumentId)
}
`
const ADD_BANK = gql`
mutation AddBank($input: BankInput!) {
  addBank(input: $input) {
    id
  }
}
`
const ACTIVEBANK = gql`
mutation SetActiveBank($setActiveBankId: ID!) {
  setActiveBank(id: $setActiveBankId)
}
`
const DELETEBANK = gql`
mutation DeleteBank($deleteBankId: ID!) {
  deleteBank(id: $deleteBankId)
}
`
export {
  CREATE_OFFER,
  UPDATE_OFFER,
  CREATE_BUSINESS,
  CREATE_SAVE_BUSINESS,
  CREATE_VIEW_BUSINESS,
  ACCEPT_ENDA,
  BUSINESS_MEETING,
  UPDATE_MEETING,
  APPROVE_MEETING,
  UPLOAD_DOC,
  FINALIZE_DEAL,
  UPDATE_DEAL,
  COUNTER_OFFER,
  SEND_BANK,
  UPLOAD_DOCUMENT,
  ADD_BANK,
  ACTIVEBANK,
  DELETEBANK,
  DELETE_DOCUMENTS,
  CREATE_ENDA
}
