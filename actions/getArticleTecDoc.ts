export const getArticleTecDoc = async (searchQuery: string) => {
  try {
    const response = await fetch(process.env.TECDOC_API_END_POINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': `${process.env.TECDOC_API_KEY}`,
      },
      body: JSON.stringify({
        getArticles: {
          articleCountry: 'dz',
          provider: process.env.TECDOC_API_PROVIDER_ID,
          searchQuery: searchQuery,
          searchType: 99,
          searchMatchType: 'exact',
          lang: 'fr',
          includeAll: true,
        },
      }),
    });
    const data = await response.json();

    type OEMTYPE = {
      mfrName: string;
      articleNumber: string;
      mfrId: number;
      matchesSearchQuery: boolean;
    };
    const formatedData = {
      oems: data?.articles?.[0]?.oemNumbers?.map((oem: OEMTYPE) => ({
        brand: oem?.mfrName,
        oemNumber: oem?.articleNumber,
      })),
      allOems: removeDuplicatesOemNumbers(
        data?.articles?.flatMap((article: any) =>
          article.oemNumbers.map((oem: OEMTYPE) => ({
            brand: oem?.mfrName,
            oemNumber: oem?.articleNumber.replaceAll(' ', ''),
          }))
        )
      ),
      technicalName: data?.articles[0]?.genericArticles[0]?.genericArticleDescription,
      imageUrl: getFirstImageUrlWith3200(data?.articles),
    };
    return {formatedData, data};
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getFirstImageUrlWith3200 = (articles: any) => {
  for (const article of articles) {
    if (article?.images?.[0]?.imageURL3200) {
      return article.images[0].imageURL3200;
    }
  }
  return null; // Return null if no article with imageURL3200 is found
};

const removeDuplicatesOemNumbers = (allOems: {brand: string; oemNumber: string}[]) => {
  const seen = new Set();
  return allOems.filter((oem) => {
    if (seen.has(oem.oemNumber)) return false;
    seen.add(oem.oemNumber);
    return true;
  });
};
