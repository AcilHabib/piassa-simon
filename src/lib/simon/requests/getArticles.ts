import {ArticlesDataType} from '~/types';

const getArticles: (id: string) => Promise<ArticlesDataType> = async (store_id) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stock/store?store_id=${store_id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    next: {
      revalidate: 600,
    },
    // cache: 'force-cache',
  });
  const data = await response.json();
  // console.log('[DATA | STOCK GET ARTICLES', data);
  return data;
};

export default getArticles;
