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
    case 'ALL_IMAGES_LOADED':
      return { ...state, allImages: { loaded: true, data: action.allImages } }
    case 'FILE_CAPTURED':
      return { ...state, file: action.file, captured: true }
    case 'IMAGE_DESCRIPTION_CHANGED':
      return {...state, image: {...state.image, description: action.imageDescription}}
    case 'UPLOADING_IMAGE':
      return {...state, image: {...state.image, description: null, uploading: true}}

    default:
      return state
  }
}

const rootReducer = combineReducers({
  web3,
  cryptogram

})

export default rootReducer