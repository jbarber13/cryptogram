import {combineReducers} from 'redux';

function web3(state = {}, action) {
    switch (action.type) {
        case 'WEB3_LOADED':
            return { ...state,  connection: action.connection }
      case 'WEB3_ACCOUNT_LOADED':
          return { ...state, account: action.account}
      default:
        return state
    }
  }
  function cryptogram(state = {}, action) {
    switch (action.type) {
        case 'CRYPTOGRAM_LOADED':
            return {...state, loaded: false, contract: action.contract }
        case 'ALL_IMAGES_LOADED': 
            return{...state, allImages: {loaded: true, data: action.allImages}}
            
      default:
        return state
    }
  }

const rootReducer = combineReducers({
	web3,
  cryptogram
  
})

export default rootReducer