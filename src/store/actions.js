/********************************************
 * passes data from interactions.js to the switch statements in reducers.js
 * 'type' refers to the case, and the value (if there is one) is passed to the action argument of the reducer function
 */

/*****************Load Accounts, Contract, Contract Data*****************/

export function web3Loaded(connection){
	return {
		type: 'WEB3_LOADED',
		connection //== connection: connection
	}
}
export function web3AccountLoaded(account){
	return {
		type: 'WEB3_ACCOUNT_LOADED',
		account
	}
}
export function cryptogramLoaded(contract){ 
    return {
        type: 'CRYPTOGRAM_LOADED', 
        contract
    }
}
export function postLoaded(post){
	//console.log("postLoaded action, id: ", post.id)
	return{
		type: 'POST_LOADED',
		post
	}
}
export function deletedPostsLoaded(deletedPosts){
	return{
		type: 'DELETED_POSTS_LOADED',
		deletedPosts
	}
}
export function commentLoaded(comment){
	return{
		type: 'COMMENT_LOADED',
		comment
	}
}

export function userLoaded(user){
	return{
		type: 'USER_LOADED',
		user
	}
}
export function userAccountLoaded(account){
	//console.log("userAccountLoaded")
	return{
		type: 'USER_ACCOUNT_LOADED',
		account
	}
}

export function userUpdateValueChanged(value){
	return{
		type: 'USER_UPADATE_VALUE_CHANGED',
		value
	}
}
export function userSelected(userSelected){
	return{
		type: 'USER_SELECTED',
		userSelected
	}
}
export function contractUpdating(message){
	return{
		type: 'CONTRACT_UPDATING',
		message
	}
}

/*****************Upload Handler*****************/
export function fileCaptured(file){
	return{
		type: 'FILE_CAPTURED',
		file		
	}
}
export function postTitleChanged(postTitle){
	return{
		type: 'POST_TITLE_CHANGED',
		postTitle
	}
}
export function postDescriptionChanged(postDescription){
	return{
		type: 'POST_DESCRIPTION_CHANGED',
		postDescription
	}
}

export function postTipAmountChanged(postTipAmount){
	return{
		type: 'POST_TIP_AMOUNT_CHANGED',
		postTipAmount
	}
}
export function commentTipAmountChanged(commentTipAmount){
	return{
		type: 'COMMENT_TIP_AMOUNT_CHANGED',
		commentTipAmount
	}
}
export function postLinkChanged(postLink){
	return{
		type: 'POST_LINK_CHANGED',
		postLink
	}
}
export function commentTextChanged(commentText){
	return{
		type: 'COMMENT_TEXT_CHANGED',
		commentText
	}
}
export function clearForm(){
	return{
		type: 'CLEAR_FORM'
	}
}

export function userNameChanged(userName){
	return{
		type: 'USERNAME_CHANGED',
		userName
	}
}
export function statusChanged(status){
	return{
		type: 'STATUS_CHANGED',
		status
	}
}
export function locationChanged(location){
	return{
		type: 'LOCATION_CHANGED',
		location
	}
}
export function occupationChanged(occupation){
	return{
		type: 'OCCUPATION_CHANGED',
		occupation
	}
}


