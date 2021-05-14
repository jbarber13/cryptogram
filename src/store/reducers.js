import { combineReducers } from 'redux';

function web3(state = {}, action) {
  switch (action.type) {
    case 'WEB3_LOADED':
      return { ...state, connection: action.connection }
    case 'WEB3_ACCOUNT_LOADED':
      return { ...state, account: action.account }
    default:
      return state
  }
}



function cryptogram(state = {}, action) {
  let index, data
  switch (action.type) {
    case 'CRYPTOGRAM_LOADED':
      return { ...state, loaded: true, contract: action.contract, allPosts: []}
    case 'ALL_POSTS_LOADED':
      return { ...state, oldAllPosts: { loaded: true, data: action.allPosts } }
    case 'POST_LOADED'://append each new post to state array, initialized when CRYPTOGRAM_LOADED
    //console.log("Action.post is correct in POST_LOADED: ", action.post)
      return {
        ...state,
        allPosts: [...state.allPosts, action.post]//Unhandled Rejection (TypeError): Invalid attempt to spread non-iterable instance unless you initialize the array when cryptogram loads
      }
    case 'DONE_LOADING_POSTS':
      return{...state, allPosts: {loaded: true, data: [...state.allPosts]}}

    case 'ALL_COMMENTS_LOADED':
      return { ...state, allComments: { loaded: true, data: action.allComments } }
    case 'CONTRACT_UPDATING':
      return { ...state, loaded: false, message: action.message }
    case 'CONTRACT_UPDATED': 
      return { ...state, loaded: true, message: action.message }
    default:
      return state
  }
}

function uploadHandler(state = {}, action) {
  switch (action.type) {
    case 'POST_TITLE_CHANGED':
      return { ...state, postTitle: action.postTitle }
    case 'POST_DESCRIPTION_CHANGED':
      return { ...state, postDescription: action.postDescription }
    case 'POST_LINK_CHANGED':
      return { ...state, postLink: action.postLink }
    case 'COMMENT_TEXT_CHANGED':
      return{...state, commentText: action.commentText}
    case 'FILE_CAPTURED':
      return { ...state, file: action.file, captured: true }
    
    default:
      return state
  }
}

const rootReducer = combineReducers({
  web3,
  cryptogram,
  uploadHandler

})

export default rootReducer
