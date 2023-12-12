import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './api';

const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

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
