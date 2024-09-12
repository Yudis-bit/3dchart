import axios from 'axios';

const fetchMultipleTokensData = async (symbols) => {
  try {
    const url = `/api/fetchCryptoPrices?symbols=${symbols.join(',')}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default fetchMultipleTokensData;
