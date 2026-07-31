import { createSlice, createSelector } from "@reduxjs/toolkit";


const savedDrafts =
  JSON.parse(localStorage.getItem("drafts")) || [];



const initialState = {


  drafts: savedDrafts,


  publishedPosts: [],


  searchQuery: ""

};



const postsSlice = createSlice({

  name: "posts",


  initialState,


  reducers: {


    saveDraft: (state, action) => {


      state.drafts.push(action.payload);


      localStorage.setItem(
        "drafts",
        JSON.stringify(state.drafts)
      );


    },



    deleteDraft: (state, action) => {


      state.drafts =
        state.drafts.filter(
          draft => draft.id !== action.payload
        );


      localStorage.setItem(
        "drafts",
        JSON.stringify(state.drafts)
      );


    },



    publishPost:(state,action)=>{


      state.publishedPosts.push(
        action.payload
      );


    },



    setSearchQuery:(state,action)=>{


      state.searchQuery =
        action.payload;


    }


  }


});




export const {

saveDraft,

deleteDraft,

publishPost,

setSearchQuery


}=postsSlice.actions;





// ===============================
// SELECTORS
// ===============================


const selectDrafts = (state)=>
state.posts.drafts;



const selectSearch = (state)=>
state.posts.searchQuery;



const selectPlatform =
(state)=>
state.platforms.selectedPlatformId;






export const selectFilteredDrafts = createSelector(

[
 selectDrafts,
 selectPlatform,
 selectSearch
],


(drafts, platformId, search)=>{


return drafts.filter((draft)=>{


// Platform filter

const platformMatch =
platformId === "all" ||
draft.platformId === platformId;



// Search filter

const searchMatch =
draft.content
?.toLowerCase()
.includes(
search.toLowerCase()
);



return platformMatch && searchMatch;


});


}


);





export const selectDraftStats = createSelector(

[
selectDrafts
],


(drafts)=>({


totalDrafts:drafts.length,


totalMedia:
drafts.filter(
d=>d.mediaName
).length


})


);



export default postsSlice.reducer;
