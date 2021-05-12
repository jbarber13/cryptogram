/********************************************
 * passes data from interactions.js to the switch statements in reducers.js
 * 'type' refers to the case, and the value (if there is one) is passed to the action argument of the reducer function
 */

//WEB3
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
export function allImagesLoaded(allImages){
	return {
		type: 'ALL_IMAGES_LOADED',
		allImages
	}
}

export function allPostsLoaded(allPosts){
	return {
		type: 'ALL_POSTS_LOADED',
		allPosts
	}
}
export function allCommentsLoaded(allComments){
	return {
		type: 'ALL_COMMENTS_LOADED',
		allComments
	}
}
export function allUsersLoaded(users){
	return{
		type: 'ALL_USERS_LOADED',
		users
	}
}

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
export function uploadingImage(){
	return{
		type: 'UPLOADING_IMAGE'
	}
}
export function contractUpdating(message){
	return{
		type: 'CONTRACT_UPDATING',
		message
	}
}
export function contractUpdated(message){
	return{
		type: 'CONTRACT_UPDATED',
		message
	}
}
