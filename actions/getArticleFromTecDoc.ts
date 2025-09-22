// import { callSOAPAPI, SOAPResponse } from '@/lib/callSOAPAPI'

// export async function getArticlesFromSOAP(params: {
//   articleCountry: string
//   provider: number
//   searchQuery?: string
//   searchType?: number // Defaults to 0 (Article Number)
//   searchMatchType?: string // Defaults to "exact"
//   legacyArticleIds?: number[]
//   dataSupplierIds?: number[]
//   lang?: string // Defaults to "en"
//   perPage?: number // Defaults to 10
//   page?: number // Defaults to 1
//   includeAll?: boolean // Defaults to false
// }): Promise<SOAPResponse | null> {
//   const {
//     articleCountry,
//     provider,
//     searchQuery = 'default',
//     searchType = 0,
//     searchMatchType = 'exact',
//     legacyArticleIds = [],
//     dataSupplierIds = [],
//     lang = 'en',
//     perPage = 10,
//     page = 1,
//     includeAll = false,
//   } = params
//   const requestBody = `
//     <tecdoc:getArticles>
//         <articleCountry>${articleCountry}</articleCountry>
//         <provider>${provider}</provider>
//         <searchQuery>${searchQuery}</searchQuery>
//         <searchType>${searchType}</searchType>
//         <searchMatchType>${searchMatchType}</searchMatchType>
//         <lang>${lang}</lang>
//         <perPage>${perPage}</perPage>
//         <page>${page}</page>
//         <includeAll>${includeAll}</includeAll>
//         <legacyArticleIds>${legacyArticleIds.join(',')}</legacyArticleIds>
//         <dataSupplierIds>${dataSupplierIds.join(',')}</dataSupplierIds>
//     </tecdoc:getArticles>
// `

//   const soapAction = `${process.env?.TECDOC_API_BASE_URL}/TecdocToCat/getArticlesRequest`

//   try {
//     const response = await callSOAPAPI(soapAction, requestBody)
//     return response
//   } catch (error) {
//     console.error('Error while fetching articles:', error)
//     return null
//   }
// }
