import { gql } from "@apollo/client";

const GETARTICLES = gql`
query GetArticles($search: String) {
  getArticles(search: $search) {
    totalCount
    articles {
      id
      title
      arabicTitle
      image
      arabicBody
      body
      isArabic
      createdAt
    }
  }
}
`
const GETARTICLE = gql`
query GetArticle($getArticleId: ID!) {
  getArticle(id: $getArticleId) {
    id
    title
    image
    body
    createdAt
  }
}
`
const GETFAQ = gql`
query GetFAQs($search: String) {
  getFAQs(search: $search) {
    totalCount
    faqs {
      id
      question
      answer
    }
  }
}
`

const GETTERMS = gql`
query GetTerms {
  getTerms {
    id
    term
    arabicTerm
  }
}
`
const GETENDATERMS = gql`
query GetNDATerms {
  getNDATerms {
    id
    ndaTerm
    arabicNdaTerm
  }
}
`
const GETPRIVACYPOLICY = gql`
query GetPrivacyPolicy {
  getPrivacyPolicy {
    id
    policy
    arabicPolicy
  }
}
`
const GETCUSTOMERROLE = gql`
query GetCustomerRole {
  getCustomerRole {
    id
    name
  }
}
`
export {
    GETARTICLES,
    GETARTICLE,
    GETFAQ,
    GETTERMS,
    GETENDATERMS,
    GETPRIVACYPOLICY,
    GETCUSTOMERROLE
}