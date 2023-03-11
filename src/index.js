import Simplelightbox from 'simplelightbox';
import { PicsApiService } from './js/pics-api-service';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const observedEl = document.querySelector('.sentinel');
// const buttonSubmit = formEl.querySelector('button');

const picsApiService = new PicsApiService();

let lightbox = new Simplelightbox('.gallery a', {
  captionDelay: 250,
});

formEl.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  picsApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  picsApiService.resetPage();
  clearGallery();
  fetchResult();
}

function fetchResult() {
  infScroll.unobserve(observedEl);
  renderByRequest();
}

function onCheckEmptyInput(hits, totalHits) {
  if (
    picsApiService.query === '' ||
    !hits.length ||
    (totalHits === 0 && totalHits <= 2)
  ) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function renderByRequest() {
  picsApiService.fetchPics().then(({ hits, totalHits }) => {
    if (picsApiService.page === 1) {
      onCheckEmptyInput(hits, totalHits);
    }

    appendPicsMarkup(hits);
    lightbox.refresh();
    infScroll.observe(observedEl);
    if (picsApiService.page === Math.ceil(totalHits / 40)) {
      infScroll.unobserve(observedEl);
      lightbox.refresh();
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    picsApiService.incrementPage();
  });
}

function appendPicsMarkup(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width=320 height=240/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

const options = {
  rootMargin: '300px',
  history: false,
};

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && picsApiService.query !== '') {
      if (picsApiService.page === 1) {
        return;
      }
      renderByRequest();
    }
  });
};

const infScroll = new IntersectionObserver(onEntry, options);
infScroll.observe(observedEl);
