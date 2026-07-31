import { createSlice, createSelector } from "@reduxjs/toolkit";

const savedDrafts = JSON.parse(localStorage.getItem("drafts")) || [];

const initialState = {
  drafts: savedDrafts,
  publishedPosts: [],
  selectedPlatformFilter: "all", // Derived state filter
  searchQuery: "",
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    saveDraft: (state, action) => {
      state.drafts.push(action.payload);
      localStorage.setItem("drafts", JSON.stringify(state.drafts));
    },
    publishPost: (state, action) => {
      state.publishedPosts.push(action.payload);
    },
    deleteDraft: (state, action) => {
      state.drafts = state.drafts.filter((draft) => draft.id !== action.payload);
      localStorage.setItem("drafts", JSON.stringify(state.drafts));
    },
    setPlatformFilter: (state, action) => {
      state.selectedPlatformFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  saveDraft,
  publishPost,
  deleteDraft,
  setPlatformFilter,
  setSearchQuery,
} = postsSlice.actions;

/* ========================================================
   MEMOIZED SELECTORS (Reselect via createSelector)
======================================================== */

// Base Input Selectors
const selectDrafts = (state) => state.posts.drafts;
const selectPublishedPosts = (state) => state.posts.publishedPosts;
const selectFilter = (state) => state.posts.selectedPlatformFilter;
const selectSearch = (state) => state.posts.searchQuery;

// 1. Memoized Selector: Filtered Drafts
export const selectFilteredDrafts = createSelector(
  [selectDrafts, selectFilter, selectSearch],
  (drafts, filter, search) => {
    return drafts.filter((draft) => {
      const matchesPlatform = filter === "all" || draft.platform === filter;
      const matchesSearch = draft.content
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }
);

// 2. Memoized Selector: Filtered Published Posts
export const selectFilteredPublished = createSelector(
  [selectPublishedPosts, selectFilter, selectSearch],
  (published, filter, search) => {
    return published.filter((post) => {
      const matchesPlatform = filter === "all" || post.platform === filter;
      const matchesSearch = post.content
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }
);

// 3. Memoized Selector: Computed Stats (Derived State)
export const selectPostStats = createSelector(
  [selectDrafts, selectPublishedPosts],
  (drafts, published) => {
    const totalMedia =
      drafts.filter((d) => d.mediaName).length +
      published.filter((p) => p.mediaName).length;

    return {
      totalDrafts: drafts.length,
      totalPublished: published.length,
      totalMediaAttached: totalMedia,
    };
  }
);

export default postsSlice.reducer;