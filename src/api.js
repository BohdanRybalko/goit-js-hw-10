import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_kJg81KMXtrfRvKqG7wd1EroCyyJXxU1vQ817RuyIzvG5Ou4AYf1idsnGq61UeN7m';

export async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCatByBreed(breedId) {
  const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
