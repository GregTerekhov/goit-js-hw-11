import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33498062-ee2b42b41cbde2a2a11e8f88d';
export class PicsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPics() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    try {
      const {
        data: { hits, totalHits },
      } = await axios.get(BASE_URL, { params });

      return { hits, totalHits };
    } catch (error) {
      console.error(error.response);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
