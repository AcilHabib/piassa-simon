import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    const {searchQuery} = await req.json();

    // 1. Adjust the TecDoc request body to include linkages
    //    The key(s) may differ based on your TecDoc subscription.
    const requestBody = {
      getArticles: {
        provider: process.env.TECDOC_API_PROVIDER_ID,
        articleCountry: 'dz',
        searchQuery,
        // searchType: 10,
        // searchMatchType: 'exact',
        // uid: searchQuery,
        lang: 'fr',
        // includeAll: true,
        // This flag and "linkingTargetType" might be required
        // to get make/model/year/motor data. Check official docs.
        includeLinkages: true,

        // linkingTargetType: 'P', // P = passenger cars (example)
      },
    };

    const response = await fetch(process.env.TECDOC_API_END_POINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.TECDOC_API_KEY ?? '',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('[TECDOC] Response:', data);

    if (!data?.articles?.length) {
      return NextResponse.json({error: 'No articles found for this query'}, {status: 404});
    }

    // 2. Extract the first article’s data or all articles if needed
    // const [firstArticle] = data.articles;
    // Linkage info might be found in firstArticle.linkages
    // or firstArticle.vehicleModelSeries, etc., depending on TecDoc’s structure
    // const linkages =
    //   firstArticle?.linkages?.map((linkage: any) => ({
    //     // Names below are placeholders! Confirm the real field names from TecDoc results
    //     brandName: linkage?.brandName ?? null,
    //     modelName: linkage?.modelName ?? null,
    //     fromYear: linkage?.yearOfConstructionFrom ?? null,
    //     toYear: linkage?.yearOfConstructionTo ?? null,
    //     motorCode: linkage?.motorCode ?? null,
    //   })) ?? [];

    // 3. Format the data as before, plus the new linkages
    // const formatedData = {
    //   oems: firstArticle?.oemNumbers?.map((oem: any) => ({
    //     brand: oem?.mfrName ?? null,
    //     oemNumber: oem?.articleNumber ?? null,
    //   })),
    //   // Flatten and deduplicate OEM references
    //   allOems: removeDuplicatesOemNumbers(
    //     data.articles.flatMap((article: any) =>
    //       article.oemNumbers.map((oem: any) => ({
    //         brand: oem?.mfrName ?? null,
    //         oemNumber: oem?.articleNumber?.replaceAll(' ', '') ?? null,
    //       }))
    //     )
    //   ),
    //   technicalName: firstArticle?.genericArticles?.[0]?.genericArticleDescription ?? null,
    //   imageUrl: getFirstImageUrlWith3200(data.articles),
    //   carModels: linkages, // new array of car fitments
    // };

    // // 4. Build partData for Prisma (or wherever you store Part records)
    // const partData = {
    //   designationTD: formatedData.technicalName,
    //   refTD: formatedData.allOems?.[0]?.oemNumber ?? null,
    //   brandName: formatedData.allOems?.[0]?.brand ?? null,
    //   image: formatedData.imageUrl ?? null,
    //   // Not typically in your Part schema, but you can store them if you want
    //   carFitments: formatedData.carModels,
    // };

    return NextResponse.json({
      data, // optional: includes all TecDoc fields
    });
  } catch (error) {
    console.error('TecDoc request error:', error);
    return NextResponse.json({error: 'TecDoc request failed'}, {status: 500});
  }
}

// If your articles have multiple images, this tries to find the first with 3200px
function getFirstImageUrlWith3200(articles: any[]) {
  for (const article of articles || []) {
    if (article?.images?.[0]?.imageURL3200) {
      return article.images[0].imageURL3200;
    }
  }
  return null;
}

// Deduplicate OEM references to avoid repeating the same brand + article number
function removeDuplicatesOemNumbers(allOems: {brand: string; oemNumber: string}[]) {
  const seen = new Set<string>();
  return allOems.filter((oem) => {
    if (!oem?.oemNumber || seen.has(oem.oemNumber)) return false;
    seen.add(oem.oemNumber);
    return true;
  });
}
