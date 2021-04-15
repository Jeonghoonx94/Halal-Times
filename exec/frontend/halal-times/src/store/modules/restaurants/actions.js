const SERVER_URL = process.env.VUE_APP_SERVER_URL;

export default {
  async loadRestaurants(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const email = context.rootGetters.getUserEmail;

    if (email === '' && payload.type === 'recommendation') return;

    let url = `${SERVER_URL}/store/list`;
    if (payload.type === 'recommendation')
      url = `${SERVER_URL}/store/list/recomm?email=${email}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      method: 'GET'
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || 'actions: loadRestaurants 실패'
      );
      throw error;
    }

    const restaurants = [];

    for (const key in responseData) {
      const restaurant = {
        restaurantId: +responseData[key].id_store,
        imgpath: responseData[key].image,
        // imgpath: 'https://i.stack.imgur.com/y9DpT.jpg',
        restaurantName: responseData[key].store_name,
        averageScore: responseData[key].averageScore,
        locationRegion: responseData[key].location_region,
        foodCategory: responseData[key].food_category,
        muslimFriendly: responseData[key].muslim_friendly,
        address: responseData[key].address,
        tel: responseData[key].tel,
        working_time: responseData[key].working_time,
        days_closed:
          responseData[key].days_closed === ''
            ? '없음'
            : responseData[key].days_closed,
        parking: responseData[key].parking === '1' ? '가능' : '불가능',
        hits: responseData[key].hits,
        reviews: responseData[key].reviews,
        lat: responseData[key].lat,
        lng: responseData[key].lng,
        bookmarked: false
      };
      restaurants.push(restaurant);
    }

    // const email = context.rootGetters.getUserEmail;

    // if (email === '') return;

    if (email !== '') {
      const responseB = await fetch(
        `${SERVER_URL}/store/bookmark/all?email=${email}`,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json;',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
          },
          method: 'GET'
        }
      );
      const responseDataB = await responseB.json();

      for (const key in responseDataB) {
        const restaurantId = +responseDataB[key].id_store;
        // console.log("restaurantId", restaurantId);
        // context.commit("modifyBookmarked", restaurantId);
        const index = restaurants.findIndex(
          restaurant => restaurant.restaurantId === restaurantId
        );
        if (index >= 0) restaurants[index].bookmarked = true;
      }
    }
    // console.log(payload.type, restaurants);

    if (payload.type === 'newestRestaurant')
      context.commit('setRestaurantList', restaurants);
    else if (payload.type === 'recommendation')
      context.commit('setRecommendRestaurants', restaurants);
    else context.commit('setRestaurants', restaurants);
    context.commit('setFetchTimestamp');
  },
  async loadBookmarks(context) {
    const email = context.rootGetters.getUserEmail;

    if (email === '') return;

    const response = await fetch(
      `${SERVER_URL}/store/bookmark/all?email=${email}`,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        method: 'GET'
      }
    );
    const responseData = await response.json();

    for (const key in responseData) {
      const restaurantId = +responseData[key].id_store;
      console.log('restaurantId', restaurantId);
      context.commit('modifyBookmarked', restaurantId);
    }
  },
  setKeyword(context, payload) {
    context.commit('setKeyword', payload);
  },
  setRestaurantInfo(context, payload) {
    // console.log("actions: setRestaurantInfo", payload);
    context.commit('setRestaurantId', payload.id);
    context.commit('setRestaurantName', payload.name);
  },
  async loadReviews(context) {
    // if (!payload.forceRefresh && !context.getters.shouldUpdate) {
    //   return;
    // }

    const response = await fetch(`${SERVER_URL}/review/list`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      method: 'GET'
    });
    const responseData = await response.json();

    const reviews = [];
    for (const key in responseData) {
      const review = {
        id_review: +responseData[key].id_review,
        id_user: +responseData[key].id_user,
        nickname: responseData[key].nickname,
        id_store: +responseData[key].id_store,
        store_name: responseData[key].store_name,
        score: +responseData[key].score,
        content: responseData[key].content,
        upload_date: responseData[key].upload_date,
        likeCnt: +responseData[key].likeCnt,
        likeCheck: +responseData[key].likeCheck === 1 ? true : false,
        thumbnail:
          responseData[key].thumbnail === null
            ? 'https://halaltimesbucket.s3.ap-northeast-2.amazonaws.com/%ED%84%B0%EB%B2%88.png'
            : responseData[key].thumbnail
      };
      // console.log("actions: loadReviews/store_name", review.store_name);
      // console.log("actions: loadReviews/thumbnail", review.thumbnail);
      reviews.push(review);
    }

    context.commit('setReviewList', reviews);
  },
  async loadLikeReviews(context) {
    console.log(
      'actions: loadLikeReviews/id_store',
      context.getters.restaurantId
    );
    const id_store = context.getters.restaurantId;
    const email = context.rootGetters.getUserEmail;

    const response = await fetch(
      `${SERVER_URL}/store?id_store=${+id_store}&email=${email}`,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        method: 'GET'
      }
    );
    const responseData = await response.json();
    // console.log('actions: loadLikeReviews/responseData', responseData);
    const reviewList = responseData.reviewList;
    // console.log('actions: loadLikeReviews/reviewList', reviewList);

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'actions: loadLikeReviews 실패'
      );
      throw error;
    }

    const bookmarked = +responseData.like === 1 ? true : false;
    const reviews = [];
    for (const key in reviewList) {
      const review = {
        id_review: +reviewList[key].id_review,
        id_user: +reviewList[key].id_user,
        nickname: reviewList[key].nickname,
        id_store: +reviewList[key].id_store,
        store_name: reviewList[key].store_name,
        score: +reviewList[key].score,
        content: reviewList[key].content,
        upload_date: reviewList[key].upload_date,
        likeCnt: +reviewList[key].likeCnt,
        likeCheck: +reviewList[key].likeCheck === 1 ? true : false,
        thumbnail:
          reviewList[key].thumbnail === null
            ? 'https://halaltimesbucket.s3.ap-northeast-2.amazonaws.com/%ED%84%B0%EB%B2%88.png'
            : reviewList[key].thumbnail
      };
      // console.log("actions: loadLikeReviews/thumbnail", review.thumbnail);
      reviews.push(review);
    }
    // console.log('actions: loadLikeReviews/reviews', reviews);
    context.commit('setBookmarked', bookmarked);
    context.commit('setReviews', reviews);
  },
  async toggleBookmark(context) {
    // console.log(
    //   'actions: loadLikeReviews/id_store',
    //   context.getters.restaurantId
    // );
    const id_store = context.getters.restaurantId;
    const email = context.rootGetters.getUserEmail;

    const response = await fetch(
      `${SERVER_URL}/store/bookmark?id_store=${id_store}&email=${email}`,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        method: 'PUT'
      }
    );
    const responseData = response.json(); // id_store, active

    responseData.then(value => {
      // console.log("actions: toggleBookmark/value", value);
      if (!response.ok) {
        alert('북마크 실패!');
        const error = new Error(
          responseData.message || 'actions: toggleBookmark 실패'
        );
        throw error;
      }
      console.log('actions: toggleBookmark/value.active', value.active);
      const bookmarked = value.active === 1 ? true : false;
      // console.log('bookmarked', bookmarked);
      context.commit('setBookmarked', bookmarked);
    });
  },
  refreshAverageScore(context) {
    const reviewList = context.getters.reviews;
    let sum = 0;

    let averageScore;
    if (reviewList.length > 0) {
      for (const key in reviewList) {
        sum += +reviewList[key].score;
      }
      averageScore = sum / reviewList.length;
    } else averageScore = 0;

    console.log('actions: refreshAverageScore/sum', sum);
    console.log('actions: refreshAverageScore/averageScore', averageScore);
    context.commit('refreshAverageScore', averageScore.toFixed(1));
  },
  async registerReview(context, payload) {
    // content, id_user, id_store, score
    console.log('payload : ', payload);
    const reviewData = {
      ...payload,
      email: context.rootGetters.getUserEmail,
      id_store: context.getters.restaurantId
    };

    console.log('actions: registerReview/reviewData', reviewData);

    const response = await fetch(`${SERVER_URL}/review`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    const responseData = await response.text();

    if (responseData === 'fail') {
      alert('리뷰 작성 실패!');
      const error = new Error(
        responseData.message || 'actions: registerReview 실패'
      );
      throw error;
    }
    return responseData;
  },
  async modifyReview(context, payload) {
    // id_review, content, score

    console.log('actions: modifyReview/payload', payload);

    const response = await fetch(`${SERVER_URL}/review/modify`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    const responseData = await response.text();

    if (responseData === 'fail') {
      alert('리뷰 수정 실패!');
      const error = new Error(
        responseData.message || 'actions: modifyReview 실패'
      );
      throw error;
    }

    context.commit('modifyReview', payload);

    return responseData;
  },
  async deleteReview(context, payload) {
    // id_review

    console.log('actions: deleteReview/payload', payload);

    const response = await fetch(
      `${SERVER_URL}/review/delete?id_review=${payload}`,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        method: 'PUT'
      }
    );
    const responseData = await response.text();

    if (responseData === 'fail') {
      alert('리뷰 삭제 실패!');
      const error = new Error(
        responseData.message || 'actions: deleteReview 실패'
      );
      throw error;
    }

    context.commit('deleteReview', payload);

    return responseData;
  },
  async toggleReviewLike(context, payload) {
    const email = context.rootGetters.getUserEmail;

    const response = await fetch(
      `${SERVER_URL}/review/like?id_review=${payload}&email=${email}`,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json;',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        method: 'PUT'
      }
    );
    const responseData = response.json(); // id_store, active

    // console.log("actions: toggleBookmark/responseData", responseData);

    responseData.then(value => {
      // console.log("actions: toggleBookmark/value", value);
      if (!response.ok) {
        alert('리뷰 좋아요 실패!');
        const error = new Error(
          responseData.message || 'actions: toggleBookmark 실패'
        );
        throw error;
      }
      console.log('actions: toggleBookmark/value.likeCheck', value.likeCheck);
      const likeCheck = +value.likeCheck === 1 ? true : false;
      const likeData = {
        id_review: payload,
        likeCnt: +value.likeCnt,
        likeCheck: likeCheck
      };
      context.commit('modifyReviewLike', likeData);
    });
  }
};
