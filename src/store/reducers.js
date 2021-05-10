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

/**
function cryptogram(state = {}, action) {
  switch (action.type) {
    case 'CRYPTOGRAM_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'ALL_IMAGES_LOADED':
      return { ...state, allImages: {...state.allImages, loaded: true} }
    case 'IMAGE_LOADED': 
      return {...state, allImages: {...state.allImages, data: action.newImage}}
    case 'FILE_CAPTURED':
      return { ...state, file: action.file, captured: true }
    case 'IMAGE_DESCRIPTION_CHANGED':
      return {...state, images: {...state.image, description: action.imageDescription}}
    case 'UPLOADING_IMAGE':
      return {...state, images: {...state.image, description: null, uploading: true}}
    default:
      return state
  }
}
 */

function cryptogram(state = {}, action) {
  let data
  switch (action.type) {
    case 'CRYPTOGRAM_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'ALL_POSTS_LOADED':
      return { ...state, allPosts: {loaded: true, data: action.allPosts} }
    case 'IMAGE_LOADED':
      return { ...state, allImages: { ...state.allImages, data: action.newImage } }
    case 'CONTRACT_UPDATING': 
      return {...state, loading: true, message: action.message}
    default:
      return state
  }
}

function uploadHandler(state = {}, action) {
  switch (action.type) {
    case 'IMAGE_DESCRIPTION_CHANGED':
      return { ...state, imageDescription: action.imageDescription }
    case 'FILE_CAPTURED':
      return { ...state, file: action.file, captured: true }
    case 'UPLOADING_IMAGE':
      return { ...state, uploading: true }
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
