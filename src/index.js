import Simplelightbox from 'simplelightbox';
import { PicsApiService } from './js/pics-api-service';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const picsApiService = new PicsApiService();
// const infiniteScroll = new IntersectionObserver();
let lightbox = new Simplelightbox('.gallery a', {
  captionDelay: 250,
});

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', fetchResult);

loadMoreBtn.classList.add('is-hidden');

function onSearch(event) {
  event.preventDefault();

  picsApiService.query = event.currentTarget.elements.searchQuery.value;
  loadMoreBtn.disabled = false;
  picsApiService.resetPage();
  clearGallery();
  fetchResult();
}

// const loadingPics = (page = 1) => {
//   fetch('https://pixabay.com/api/');
// };

function fetchResult() {
  loadMoreBtn.disabled = true;
  picsApiService.fetchPics().then(({ hits, totalHits }) => {
    if (!hits.length || hits.length <= 3) {
      loadMoreBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (hits.length === totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.disabled = false;
      appendPicsMarkup({ hits });
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      lightbox.refresh();
    }
  });
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0.3,
    behavior: 'smooth',
  });
}

function appendPicsMarkup({ hits }) {
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
  loadMoreBtn.classList.remove('is-hidden');
  smoothScroll();
}

function clearGallery() {
  galleryEl.innerHTML = '';
}
