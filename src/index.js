import Simplelightbox from 'simplelightbox';
import { PicsApiService } from './js/pics-api-service';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const picsApiService = new PicsApiService();

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', fetchResult);
loadMoreBtn.classList.add('is-hidden');

function onSearch(event) {
  event.preventDefault();

  picsApiService.query = event.currentTarget.elements.searchQuery.value;

  if (picsApiService.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  Notiflix.Notify.success('Hooray! We found totalHits images.');
  loadMoreBtn.disabled = false;
  picsApiService.resetPage();
  clearGallery();
  fetchResult();
  galleryEl.refresh();
}

function fetchResult() {
  loadMoreBtn.disabled = true;
  picsApiService.fetchPics().then(hits => {
    loadMoreBtn.disabled = false;
    appendPicsMarkup(hits);
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
  //   Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  let lightbox = new Simplelightbox('.gallery a', {
    captionDelay: 250,
  });
  //   galleryEl.refresh();
  loadMoreBtn.classList.remove('is-hidden');
}

function clearGallery() {
  galleryEl.innerHTML = '';
}
