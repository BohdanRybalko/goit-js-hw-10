import axios from 'axios';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

axios.defaults.headers.common['x-api-key'] = 'your_api_key';

export function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .catch(error => {
      throw error;
    });
}

const breedSelect = new SlimSelect({
  select: '#breedSelect',
  placeholder: 'Select a breed',
});

const catInfoDiv = document.querySelector('.cat-info');
const catImage = document.getElementById('catImage');
const catBreed = document.getElementById('catBreed');
const catDescription = document.getElementById('catDescription');
const catTemperament = document.getElementById('catTemperament');
const loader = document.getElementById('loader');
const error = document.getElementById('error');

breedSelect.setData(
  fetchBreeds().then(breeds =>
    breeds.map(breed => ({ text: breed.name, value: breed.id }))
  )
);

breedSelect.on('change', info => {
  const selectedBreedId = info.value();
  loader.style.display = 'block';
  catInfoDiv.style.display = 'none';
  error.style.display = 'none';

  fetchCatByBreed(selectedBreedId)
    .then(catData => {
      catImage.src = catData.url;
      catBreed.textContent = `Breed: ${catData.breeds[0].name}`;
      catDescription.textContent = `Description: ${catData.breeds[0].description}`;
      catTemperament.textContent = `Temperament: ${catData.breeds[0].temperament}`;
      catInfoDiv.style.display = 'block';
    })
    .catch(() => {
      error.style.display = 'block';
    })
    .finally(() => {
      loader.style.display = 'none';
    });
});
