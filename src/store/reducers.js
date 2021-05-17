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
  switch (action.type) {
    case 'CRYPTOGRAM_LOADED':
      return { ...state, loaded: true, contract: action.contract, allPosts: [], allComments: [], allUsers: [], message: "loaded" }    
    case 'POST_LOADED'://append each new post to state array, initialized when CRYPTOGRAM_LOADED
      if(state.loaded){
        return {
          ...state,
          allPosts: [...state.allPosts, action.post]//Unhandled Rejection (TypeError): Invalid attempt to spread non-iterable instance unless you initialize the array when cryptogram loads
        }
      }    
    case 'COMMENT_LOADED':
      return {
        ...state,
        allComments: [...state.allComments, action.comment]
      }
    case 'USER_LOADED': 
      return {
        ...state, 
        allUsers: [...state.allUsers, action.user]
      }
    case 'CONTRACT_UPDATING':
      return { ...state, loaded: false, message: action.message }    
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
      return { ...state, commentText: action.commentText }
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
