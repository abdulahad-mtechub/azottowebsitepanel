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
`;
const GETARTICLE = gql`
  query GetArticle($getArticleId: ID!) {
    getArticle(id: $getArticleId) {
      id
      image
      title
      arabicTitle
      body
      arabicBody
      createdAt
      isArabic
    }
  }
`;
const GETFAQ = gql`
  query getFAQs($search: String) {
    getFAQs(search: $search) {
      totalCount
      faqs {
        id
        question
        arabicQuestion
        answer
        arabicAnswer
        isArabic
      }
    }
  }
`;
const GETTERMS = gql`
  query GetTerms {
    getTerms {
      id
      term
      arabicTerm
      isArabic
    }
  }
`;
const GETENDATERMS = gql`
  query GetNDATerms {
    getNDATerms {
      id
      ndaTerm
      arabicNdaTerm
      isArabic
    }
  }
`;
const GETPRIVACYPOLICY = gql`
  query GetPrivacyPolicy {
    getPrivacyPolicy {
      id
      policy
      arabicPolicy
      isArabic
    }
  }
`;
const GETCUSTOMERROLE = gql`
  query GetCustomerRole {
    getCustomerRole {
      id
      name
    }
  }
`;

const GET_SETTING = gql`
  query GetSetting {
    getSetting {
      commissionRate
    }
  }
`;

export {
  GETARTICLES,
  GETARTICLE,
  GETFAQ,
  GETTERMS,
  GETENDATERMS,
  GETPRIVACYPOLICY,
  GETCUSTOMERROLE,
  GET_SETTING,
};
