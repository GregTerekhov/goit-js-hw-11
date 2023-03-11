import Simplelightbox from 'simplelightbox';
import { PicsApiService } from './js/pics-api-service';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const observedEl = document.querySelector('.sentinel');

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
  picsApiService.fetchPics().then(({ hits, totalHits }) => {
    if (!hits.length || hits.length <= 3) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    appendPicsMarkup(hits);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    lightbox.refresh();
    infScroll.observe(observedEl);
    smoothScroll();
    if (picsApiService.page === Math.ceil(totalHits / 40)) {
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    picsApiService.incrementPage();
  });
}

function smoothScroll() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0.35,
    behavior: 'smooth',
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
      picsApiService.fetchPics().then(({ hits, totalHits }) => {
        appendPicsMarkup(hits);

        if (picsApiService.page === Math.ceil(totalHits / 40)) {
          infScroll.unobserve(observedEl);
          return Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
        console.log(picsApiService.page);
        picsApiService.incrementPage();
        infScroll.observe(observedEl);
        lightbox.refresh();
      });
    }
  });
};

const infScroll = new IntersectionObserver(onEntry, options);
infScroll.observe(observedEl);
