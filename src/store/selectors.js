import { createSelector } from 'reselect'
import moment from 'moment'
import {get, groupBy, reject, maxBy, minBy} from 'lodash'

//web3.account --> reducer.js function.value for that case
const account = state => get(state, 'web3.account')//lodash - provides default value incase null
export const accountSelector = createSelector(account, a => a) //(account) => {return  account})

const web3 = state => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, w => w) 

const cryptogramLoaded = state => get(state, 'cryptogram.loaded', false)
export const cryptogramLoadedSelector = createSelector(cryptogramLoaded, cl => cl)


const cryptogram = state => get(state, 'cryptogram.contract')
export const cryptogramSelector = createSelector(cryptogram, c => c) 

const users = state => get(state, 'cryptogram.users.data', [])
export const usersSelector = createSelector(users, u => u )


const allImages = state => get(state, 'cryptogram.allImages.data', [])
export const allImagesSelector = createSelector(
    allImages, 
    ai => ai    
)
const allPosts = state => get(state, 'cryptogram.allPosts.data', [])
export const allPostSelector = createSelector(
    allPosts, 
    ap => ap    
)


const contractUpdating = state => get(state, 'cryptogram.loading', true)
export const contractUpdatingSelector = createSelector(contractUpdating, cu => cu)

const fileUploaded = state => get(state, 'uploadHandler.captured', [])
export const fileUploadedSelector = createSelector(fileUploaded, fu => fu)

const file = state => get(state, 'uploadHandler.file', [])
export const fileSelector = createSelector(file, f => f)


const postTitle = state => get(state, 'uploadHandler.postTitle', {})
export const postTitleSelector = createSelector(postTitle, pt => pt)

const postDescription = state => get(state, 'uploadHandler.postDescription', {})
export const postDescriptionSelector = createSelector(postDescription, i => i)

const postLink = state => get(state, 'uploadHandler.postLink', {})
export const postLinkSelector = createSelector(postLink, i => i)
