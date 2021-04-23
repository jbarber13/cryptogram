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
export function imageLoaded(image){
	return {
		type: 'IMAGE_LOADED',
		image
	}
}
export function loadImage(newImage){
	return {
		type: 'IMAGE_LOADED',
		newImage
	}
}
export function allImagesLoaded(allImages){
	return {
		type: 'ALL_IMAGES_LOADED',
		allImages
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
export function imageDescriptionChanged(imageDescription){
	return{
		type: 'IMAGE_DESCRIPTION_CHANGED',
		imageDescription
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