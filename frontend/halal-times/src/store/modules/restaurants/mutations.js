export default {
  setRestaurants(state, payload) {
    state.restaurants = payload;
  },
  setKeyword(state, payload) {
    state.keyword = payload;
  },
  setRestaurantId(state, payload) {
      state.restaurantId = payload;
  },
  setRestaurantName(state, payload) {
      state.restaurantName = payload;
  },
  setReviews(state, payload) {
    state.reviews = payload;
  },
  modifyReviewLike(state, payload) {
    const index = state.reviews.findIndex(review => review.id_review === payload.id_review);
    state.reviews[index].likeCnt = payload.likeCnt;
    state.reviews[index].likeCheck = payload.likeCheck;
  },
  modifyReview(state, payload) {
    const index = state.reviews.findIndex(review => review.id_review === payload.id_review);
    state.reviews[index].content = payload.content;
    state.reviews[index].score = payload.score;
  },
  deleteReview(state, payload) {
    const index = state.reviews.findIndex(review => review.id_review === payload);
    state.reviews.splice(index, 1);
  },
  setBookmarked(state, payload) {
    state.bookmarked = payload;
  },
  refreshAverageScore(state, payload) {
    state.averageScore = payload;
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  }
};
