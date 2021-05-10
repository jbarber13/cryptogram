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
      return { ...state, loaded: true, contract: action.contract }
    case 'ALL_POSTS_LOADED':
      return { ...state, allPosts: { loaded: true, data: action.allPosts } }
    case 'IMAGE_LOADED':
      return { ...state, allImages: { ...state.allImages, data: action.newImage } }
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
