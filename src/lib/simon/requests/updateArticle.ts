import axios from 'axios';

const updateArticle = async (id: string, data: Record<string, any>) => {
  console.log('[UPDATE ARTICLE]:', id, data);
  try {
    const response = await axios.patch(`/api/stock/store?store_id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

export default updateArticle;
