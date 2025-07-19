import { gql } from "@apollo/client";

const CREATE_OFFER = gql`
  mutation CreateOffer($input: CreateOfferInput!) {
  createOffer(input: $input) {
    id
  }
}
`
const UPDATE_OFFER = gql `
  mutation UpdateOffer($input: UpdateOfferInput) {
  updateOffer(input: $input) {
    status
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
const BUSINESS_MEETING = gql `
  mutation UpdateBusiness($input: UpdateBusinessInput!) {
  updateBusiness(input: $input) {
    id
  }
}
`
export {
  CREATE_OFFER,
  UPDATE_OFFER,
  CREATE_BUSINESS,
  CREATE_SAVE_BUSINESS,
  CREATE_VIEW_BUSINESS,
  ACCEPT_ENDA,
  BUSINESS_MEETING
}
