import axios from 'axios';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const catInfo = document.querySelector('.cat-info');
// const catImage = document.getElementById('cat-image');
// const breedName = document.getElementById('breed-name');
// const description = document.getElementById('description');
// const temperament = document.getElementById('temperament');
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

breedSelect.selectEl.addEventListener('change', function (event) {
  const selectedBreedId = event.target.value;
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
  catInfo.innerHTML = `<img id="cat-image" alt="Cat Image" src="${cat.url}" width="200px" />
      <p id="breed-name">${cat.breeds[0].name}</p>
      <p id="description">${cat.breeds[0].description}</p>
      <p id="temperament">${cat.breeds[0].temperament}</p>`;
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
