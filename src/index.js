import axios from 'axios';
import SlimSelect from 'slim-select';

const catInfo = document.querySelector('.cat-info');
const catImage = document.getElementById('cat-image');
const breedName = document.getElementById('breed-name');
const description = document.getElementById('description');
const temperament = document.getElementById('temperament');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

axios.defaults.headers.common['x-api-key'] =
  'live_kJg81KMXtrfRvKqG7wd1EroCyyJXxU1vQ817RuyIzvG5Ou4AYf1idsnGq61UeN7m';

export function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;
  return axios
    .get(url)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
const breedSelect = new SlimSelect({
  select: '#breed-select',
  placeholder: 'Select a breed',
});

fetchBreeds()
  .then(breeds => {
    breedSelect.setData(
      breeds.map(breed => ({ text: breed.name, value: breed.id }))
    );
  })
  .catch(() => {
    showError();
  });

breedSelect.on('change', function () {
  const selectedBreedId = this.data.selected();
  if (selectedBreedId) {
    showLoader();
    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        displayCatInfo(catData[0]);
      })
      .catch(() => {
        showError();
      })
      .finally(() => {
        hideLoader();
      });
  }
});

function displayCatInfo(cat) {
  catInfo.style.display = 'block';
  catImage.src = cat.url;
  breedName.textContent = `Breed: ${cat.breeds[0].name}`;
  description.textContent = `Description: ${cat.breeds[0].description}`;
  temperament.textContent = `Temperament: ${cat.breeds[0].temperament}`;
}

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showError() {
  error.style.display = 'block';
}
