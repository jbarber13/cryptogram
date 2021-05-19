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

const allUsers = state => get(state, 'cryptogram.allUsers', [])
export const allUsersSelector = createSelector(allUsers, u => u )

const userExists = state => get(state, 'cryptogram.userExists', false)
export const userExistsSelector = createSelector(userExists, ue => ue)



const allPosts = state => get(state, 'cryptogram.allPosts', [])
export const allPostSelector = createSelector(
    allPosts, 
    ap => ap    
)

const allComments = state => get(state, 'cryptogram.allComments', [])
export const allCommentsSelector = createSelector(
    allComments, 
    (comments) => {
        //console.log("AllComments: ", comments)
        comments = decorateAllComments(comments)
        return comments
    }
)

const decorateAllComments = (comments) => {
    return(
        comments.map((comment) => {
            //console.log("decorateAllComments: ", comment.postID)
            comment = decorateComment(comment)
            return comment
        })
    )
}

const decorateComment = (comment) => {
    //console.log("decorateComment: ", comment.postID)
    return({
        ...comment,        
        formattedTimeStamp: moment.unix(comment.timeStamp).format('h:mm:ss a M/D/Y') //hours mins seconds AM/PM Month/Day/Year -- https://momentjs.com/
    })
}










/**
const contractUpdating = state => get(state, 'cryptogram.loaded', true)
export const contractUpdatingSelector = createSelector(contractUpdating, cu => cu)
 */





/*******************************UPLOAD HANDLER**********************************/
const postTitle = state => get(state, 'uploadHandler.postTitle', {})
export const postTitleSelector = createSelector(postTitle, pt => pt)

const postDescription = state => get(state, 'uploadHandler.postDescription', {})
export const postDescriptionSelector = createSelector(postDescription, i => i)

const postLink = state => get(state, 'uploadHandler.postLink', {})
export const postLinkSelector = createSelector(postLink, i => i)

const commentText = state => get(state, 'uploadHandler.commentText', {})
export const commentTextSelector = createSelector(commentText, ct => ct)

const fileUploaded = state => get(state, 'uploadHandler.captured', [])
export const fileUploadedSelector = createSelector(fileUploaded, fu => fu)
const file = state => get(state, 'uploadHandler.file', [])
export const fileSelector = createSelector(file, f => f)

const userName = state => get(state, 'uploadHandler.userName', [])
export const userNameSelector = createSelector(userName, u => u)

const status = state => get(state, 'uploadHandler.status', [])
export const statusSelector = createSelector(status, s => s)

const location = state => get(state, 'uploadHandler.location', [])
export const locationSelector = createSelector(location, l => l)

const contact = state => get(state, 'uploadHandler.contact', [])
export const contactSelector = createSelector(contact, c => c)

const occupation = state => get(state, 'uploadHandler.occupation', [])
export const occupationSelector = createSelector(occupation, o => o)
