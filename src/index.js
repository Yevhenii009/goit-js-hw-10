import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputValue = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputValue.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(element) {
    element.preventDefault();
    let search = inputValue.value;

    if (search.trim() === "") {
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        return;
    };

    fetchCountries(search.trim())
        .then(countries => {
        
            if (countries.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                countryList.innerHTML = "";
                countryInfo.innerHTML = "";
                return;
            }

            if (countries.length > 1 && countries.length <= 10) {
                const markup = countries.map(country => countryName(country));
                countryList.innerHTML = markup.join('');
                countryInfo.innerHTML = "";
            }

            if (countries.length === 1) {
                const cardMarcup = countries.map(country => countryCard(country));
                countryList.innerHTML = "";
                countryInfo.innerHTML = cardMarcup.join('');
            }
        })
    
    .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        return error;
    });
};

function countryName({ flags, name }){
    return `
    <li class = country-item>
    <img class = 'country-list__flags' src="${flags.svg}" alt="${name.official}" width=50/>
    <h2 class = country-list__name>${name.official}</h2>
    </li>
    `
};


function countryCard({ flags, name, capital, population, languages }) {
    return `
    <div class="country">
      <img class = "capital-flag" src="${flags.svg}" alt="${name.official}" width = 100/>
      <h2 class = "country-title">Country: ${name.official}</h2>
      <p class = "country-text">Capital: ${capital}</p>
      <p class="country-text">Population: ${population}</p>
      <p class="country-text">Languages: ${Object.values(languages)}</p>
    </div>
    `
};


