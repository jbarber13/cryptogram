import { createSelector } from 'reselect'
import moment from 'moment'
import {get} from 'lodash'


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

const allUserIDs = state => {
    const au = allUsers(state)
    return(
        au.map((user) => {
            return user.userAccount
        })
    )
}
export const allUserIDSelector = createSelector(allUserIDs, aui => aui)

const userAccountLoaded = state => get(state, 'cryptogram.userAccountLoaded', false)
export const userAccountLoadedSelector = createSelector(userAccountLoaded, ue => ue)

const myAccount = state => get(state, 'cryptogram.userAccount', false)
export const myAccountSelector = createSelector(myAccount, ma => ma)

const user = state => get(state, 'cryptogram.userAccount', false)
export const userSelector = createSelector(user, u => u)

const userSelected = state => get(state, 'cryptogram.userSelected', false)
export const userSelectedSelector = createSelector(userSelected, us => us)

const allPosts = state => get(state, 'cryptogram.allPosts', [])
export const allPostSelector = createSelector(
    allPosts, 
    (posts) => {
        //sort by tipAmount
        posts = posts.sort((a,b) => b.tipAmount - a.tipAmount)
        return posts
    }    
)

const allPosters = state => {
    const ap = allPosts(state)
    return(
        ap.map((post) => {
            return post.author
        })
    )
}
export const allPosterSelector = createSelector(allPosters, ap => ap)


const deletedPosts = state => get(state, 'cryptogram.deletedPosts', [])
const deletedPostIDs = state => {
    const dp = deletedPosts(state)
    return(
        dp.map((post) => {
            return post.id
        })
    )
}
export const deletedPostIDSelector = createSelector(deletedPostIDs, dpi => dpi)

const myPosts = state => {
    const posts = allPosts(state)
    const account = user(state)
    return(
        posts.map((post) =>{
            post = decorateMyPost(post, account)
            if(post != undefined){
                return post
            }            
        })
    )
}
const decorateMyPost = (post, account) =>{
    
    if(post != undefined){
        if(post.author === account[0]){
            return {...post}
        }
    }   
}
export const myPostSelector = createSelector(
    myPosts, 
    mp => mp
)

const allComments = state => get(state, 'cryptogram.allComments', [])
export const allCommentsSelector = createSelector(
    allComments, 
    (comments) => {
        //console.log("AllComments: ", comments)
        comments = decorateAllComments(comments)
        comments = comments.sort((a,b) => b.tipAmount - a.tipAmount)
        return comments
    }
)

const myComments = state => {
    const comments = allComments(state)
    const account = user(state)
    return(
        comments.map((comment) =>{
            //console.log("My Comments Mapping: ", comment)
            comment = decorateMyComment(comment, account)
            if(comment != undefined){
                return comment
            }            
        })
    )
}
const decorateMyComment = (comment, account) =>{
    
    if(comment != undefined){
        if(comment.author === account[0]){
            return({
                ...comment,        
                formattedTimeStamp: moment.unix(comment.timeStamp).format('h:mm:ss a M/D/Y') //hours mins seconds AM/PM Month/Day/Year -- https://momentjs.com/
            })
        }
    }   
}
export const myCommentSelector = createSelector(
    myComments, 

    (comments) => {
        //sort by tipAmount
        comments = comments.sort((a,b) => b.tipAmount - a.tipAmount)

        return comments
    }
)

const decorateAllComments = (comments) => {
    return(
        comments.map((comment) => {
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

const userUpdateValue = state => get(state, 'uploadHandler.userUpdateValue', "")
export const userUpdateValueSelector = createSelector(userUpdateValue, uuv => uuv)

const postTipAmount = state => get(state, 'uploadHandler.postTipAmount', "0")
export const postTipAmountSelector = createSelector(postTipAmount, pta => pta)

const commentTipAmount = state => get(state, 'uploadHandler.commentTipAmount', "0")
export const commentTipAmountSelector = createSelector(commentTipAmount, cta => cta)
