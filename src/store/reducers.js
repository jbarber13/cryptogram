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
        //console.log("case: POST_LOADED, id: ", action.post.id)
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
    case 'USER_ACCOUNT_LOADED':
      return{...state, userAccount: action.account, userAccountLoaded: true}
    case 'USER_UPADATE_VALUE_CHANGED':
      return{...state, userUpdateValue: action.value}


















    case 'EVENT_HEARD':
        return{
          ...state, 
          eventHeard: action.eventHeard
        }
    case 'LOADING_COMPLETE':
        return{
          ...state,
          eventHeard: false
        }
    //things are still breaking when the user account is switched, restarting the server fixes it...
    //for some reason, this causes duplicates to appear after the second time it is called
    /**
     case 'CONTRACT_UPDATING':
      console.log("CONTRACT_UPDATING")
      return { ...state, loaded: false, message: action.message } 
     */
       
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
/*****************Create User Account*****************/
    case 'USERNAME_CHANGED': 
      return{...state, userName: action.userName}
    case 'STATUS_CHANGED': 
      return{...state, status: action.status}
    case 'LOCATION_CHANGED': 
      return{...state, location: action.location}
    case 'CONTACT_CHANGED': 
      return{...state, contact: action.contact}
    case 'OCCUPATION_CHANGED': 
      return{...state, occupation: action.occupation}

/*****************Clear Form from state after submit*****************/
    case 'CLEAR_FORM':
      return {...state, postTitle:"", postDescription:"", postLink:"", commentText:"", file:"", captured: false, userName:"", status:"", location:"", contact:"", occupation:"", }
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
