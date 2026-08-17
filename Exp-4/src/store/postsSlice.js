import { createSlice, nanoid } from "@reduxjs/toolkit";
import { samplePosts } from "../data/samplePosts";

const initialState = {
  items: samplePosts,
  selectedPostId: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ title, platform, date, time, content }) {
        return {
          payload: {
            id: nanoid(),
            title,
            platform,
            date,
            time,
            content,
            status: "draft",
          },
        };
      },
    },
    updatePost(state, action) {
      const { id, changes } = action.payload;
      const post = state.items.find((p) => p.id === id);
      if (post) Object.assign(post, changes);
    },
    deletePost(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    // Drag-and-drop scheduling: move a post to a new date (and optionally a new time).
    reschedulePost(state, action) {
      const { id, date, time } = action.payload;
      const post = state.items.find((p) => p.id === id);
      if (post) {
        post.date = date;
        if (time) post.time = time;
      }
    },
    selectPost(state, action) {
      state.selectedPostId = action.payload;
    },
  },
});

export const { addPost, updatePost, deletePost, reschedulePost, selectPost } = postsSlice.actions;

export default postsSlice.reducer;

// Selectors
export const selectAllPosts = (state) => state.posts.items;
export const selectSelectedPostId = (state) => state.posts.selectedPostId;
