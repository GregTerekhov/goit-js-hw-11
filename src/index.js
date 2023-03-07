import Simplelightbox from 'simplelightbox';
import { PicsApiService } from './js/pics-api-service';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const picsApiService = new PicsApiService();

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  picsApiService.query = event.currentTarget.elements.searchQuery.value;
  picsApiService.resetPage();
  picsApiService.fetchPics().then(appendPicsMarkup);
}

function onLoadMore() {
  picsApiService.fetchPics().then(appendPicsMarkup);
}

function appendPicsMarkup(hits) {
  const markup = hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  //   Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  //   let lightbox = new Simplelightbox(galleryEl);
  //   galleryEl.refresh();
}
