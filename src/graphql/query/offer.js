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
const BUYERINPROGRESSDEALS = gql`
query GetBuyerInprogressDeals($limit: Int, $offset: Int, $search: String) {
  getBuyerInprogressDeals(limit: $limit, offset: $offset, search: $search) {
    id
    status
    buyer {
      id
      name
    }
      isDsaBuyer
      isCommissionVerified
    business {
      id
      businessTitle
      seller {
        id
        name
      }
    }
    price
    createdAt
  }
}
`
const SELLERINPROGRESSDEALS = gql`
query GetSellerInprogressDeals($limit: Int, $offset: Int, $search: String) {
  getSellerInprogressDeals(limit: $limit, offset: $offset, search: $search) {
    id
    buyer {
      id
      name
    }
      isDsaSeller
    business {
      id
      businessTitle
    }
    price
    createdAt
  }
}
`
const BUYERDEALS = gql`
query GetBuyerCompletedDeals($limit: Int, $offset: Int, $search: String) {
  getBuyerCompletedDeals(limit: $limit, offset: $offset, search: $search) {
    id
    buyer {
      id
      name
    }
    business {
      id
      businessTitle
    seller {
      id
      name
    }
    }
    price
    createdAt
  }
}
`
const SELLERDEALS = gql`
query GetSellerCompletedDeals($limit: Int, $offset: Int, $search: String) {
  getSellerCompletedDeals(limit: $limit, offset: $offset, search: $search) {
    id
    buyer {
      id
      name
    }
    business {
      id
      businessTitle
    
    }
    price
    createdAt
  }
}
`
const GETDEAL = gql `
query GetDeal($getDealId: ID!) {
  getDeal(id: $getDealId) {
    id
    price
    status
    isDsaSeller
    isDsaBuyer
    isPaymentVedifiedSeller
    isDocVedifiedSeller
    isDocVedifiedAdmin
    isCommissionVerified
    isPaymentVedifiedAdmin
    isBuyerCompleted
    isSellerCompleted
    isDocVedifiedBuyer
    createdAt
    business {
      id
      businessTitle
      seller {
        id
        name
      }
      documents {
        title
        filePath
      }
    }
    buyer {
      id
      name
      banks {
        id
        bankName
        iban
        accountTitle
      }
    }
    offer {
      id
      price
      status
    }
  }
}
`
const GETBANKSFORDEAL = gql `
query GetBankDetailsByDealId($dealId: ID!) {
  getBankDetailsByDealId(dealId: $dealId) {
    id
    isSend
    bank {
      id
      bankName
      iban
      accountTitle
    }
  }
}
`
const GET_BUSINESS_OFFERS = gql `
query GetOfferByBusinessId($getOfferByBusinessIdId: ID, $limit: Int, $offSet: Int, $search: String, $status: String) {
  getOfferByBusinessId(id: $getOfferByBusinessIdId, limit: $limit, offSet: $offSet, search: $search, status: $status) {
    count
    offers {
      id
      price
      status
      createdAt
      createdBy
      isProceedToPay
      business {
        id
        businessTitle
        price
        
      }
      buyer {
        id
        name
      }
    }
  }
}
`
export {
    OFFERBYBUYER,
    OFFERBYSELLER,
    OFFERBYID,
    BUYERDEALS,
    SELLERDEALS,
    BUYERINPROGRESSDEALS,
    SELLERINPROGRESSDEALS,
    GETDEAL,
    GET_BUSINESS_OFFERS,
    GETBANKSFORDEAL,
}
