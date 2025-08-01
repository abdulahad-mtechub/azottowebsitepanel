import { gql } from "@apollo/client";


const OFFERBYBUYER = gql`
query GetOffersByUser($status: OfferStatus, $search: String) {
  getOffersByUser(status: $status, search: $search) {
    id
    price
    createdAt
    business {
      businessTitle
      price
      seller {
        name
      }
    }
  }
}
`
const OFFERBYSELLER = gql`
query GetOffersBySeller($status: OfferStatus, $search: String) {
  getOffersBySeller(status: $status, search: $search) {
    id
    price
    createdAt
    business {
      businessTitle
      price
      seller {
        name
      }
    }
  }
}
`

const OFFERBYID = gql`
query GetOffersById($getOffersByIdId: String) {
  getOffersById(id: $getOffersByIdId) {
    id
    price
    message
    status
    createdAt
    business {
      businessTitle
      seller {
        name
        banks {
          id
          bankName
          accountNumber
          createdAt
          accountTitle
        }
      }
    }
    buyer {
      name
    }
  }
}
`
export {
    OFFERBYBUYER,
    OFFERBYSELLER,
    OFFERBYID
}
