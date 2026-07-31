import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectFilteredDrafts,
  deleteDraft,
  publishPost,
  setSearchQuery
} from "../features/posts/postsSlice";

import {
  selectAllPlatforms,
  selectSelectedPlatformId,
  setSelectedPlatform
} from "../features/platforms/platformsSlice";


function DraftList() {

  const dispatch = useDispatch();


  const drafts = useSelector(selectFilteredDrafts) || [];


  const platforms = useSelector(
    selectAllPlatforms
  );


  const selectedPlatformId = useSelector(
    selectSelectedPlatformId
  );


  const searchQuery = useSelector(
    state => state.posts.searchQuery || ""
  );



  const getPlatformName = (id) => {

    const platform = platforms.find(
      p => p.id === id
    );


    return platform
      ? platform.name
      : "General";

  };



  return (

    <div style={styles.container}>


      {/* Header */}

      <div style={styles.header}>

        <div>

          <h2 style={styles.title}>
            📂 Drafts
          </h2>


          <span style={styles.count}>
            {drafts.length} drafts
          </span>

        </div>



        <div style={styles.controls}>


          <select

            value={selectedPlatformId}

            onChange={(e)=>
              dispatch(
                setSelectedPlatform(
                  e.target.value
                )
              )
            }

            style={styles.select}

          >


            <option value="all">
              All Platforms
            </option>


            {
              platforms.map(platform=>(

                <option
                  key={platform.id}
                  value={platform.id}
                >

                  {platform.name}

                </option>

              ))
            }


          </select>



          <input

            value={searchQuery}

            onChange={(e)=>
              dispatch(
                setSearchQuery(
                  e.target.value
                )
              )
            }


            placeholder="Search drafts..."

            style={styles.input}

          />


        </div>


      </div>





      {/* Draft List */}


      {
        drafts.length === 0 ?


        (

          <div style={styles.empty}>

            No drafts available

          </div>

        )


        :


        (

          <div style={styles.list}>


          {
            drafts.map(draft=>(


              <div
                key={draft.id}
                style={styles.card}
              >


                <div>


                  <p style={styles.content}>

                    {
                      draft.content ||
                      "Empty draft"
                    }

                  </p>



                  <div style={styles.meta}>


                    <span style={styles.tag}>

                      {
                        getPlatformName(
                          draft.platformId
                        )
                      }

                    </span>



                    <span style={styles.time}>

                      {
                        draft.createdAt
                        ?
                        new Date(
                          draft.createdAt
                        ).toLocaleString()
                        :
                        ""
                      }

                    </span>


                  </div>


                </div>




                <div style={styles.buttons}>


                  <button

                    onClick={()=>
                      dispatch(
                        publishPost(draft)
                      )
                    }

                    style={styles.publish}

                  >

                    Publish

                  </button>



                  <button

                    onClick={()=>
                      dispatch(
                        deleteDraft(
                          draft.id
                        )
                      )
                    }

                    style={styles.delete}

                  >

                    Delete

                  </button>


                </div>


              </div>


            ))
          }


          </div>

        )

      }


    </div>

  );

}



const styles = {


container:{

background:"#fff",

borderRadius:"16px",

padding:"24px",

boxShadow:
"0 8px 20px rgba(0,0,0,.08)"

},


header:{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

marginBottom:"20px",

flexWrap:"wrap",

gap:"15px"

},


title:{

margin:0,

fontSize:"22px",

color:"#111827"

},


count:{

background:"#e0e7ff",

color:"#3730a3",

padding:"5px 12px",

borderRadius:"20px",

fontSize:"13px"

},


controls:{

display:"flex",

gap:"10px"

},


select:{

padding:"10px",

borderRadius:"8px",

border:"1px solid #cbd5e1"

},


input:{

padding:"10px",

borderRadius:"8px",

border:"1px solid #cbd5e1"

},


list:{

display:"flex",

flexDirection:"column",

gap:"12px"

},


card:{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

padding:"16px",

border:"1px solid #e5e7eb",

borderRadius:"12px",

background:"#fafafa"

},


content:{

margin:0,

fontSize:"16px",

fontWeight:"600"

},


meta:{

display:"flex",

gap:"10px",

marginTop:"8px"

},


tag:{

background:"#dbeafe",

color:"#1d4ed8",

padding:"4px 10px",

borderRadius:"10px",

fontSize:"12px"

},


time:{

fontSize:"12px",

color:"#64748b"

},


buttons:{

display:"flex",

gap:"8px"

},


publish:{

background:"#10b981",

color:"#fff",

border:"none",

padding:"8px 14px",

borderRadius:"8px",

cursor:"pointer"

},


delete:{

background:"#fee2e2",

color:"#dc2626",

border:"none",

padding:"8px 14px",

borderRadius:"8px",

cursor:"pointer"

},


empty:{

padding:"40px",

textAlign:"center",

color:"#64748b"

}


};


export default DraftList;
