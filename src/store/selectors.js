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

const images = state => get(state, 'cryptogram.images.data', [])//return empty array if it doesn't exist
export const imagesSelector = createSelector(
    images,
    (img) => {
        //sort by tipAmount
        img = img.sort((a,b) => a.tipAmount - b.tipAmount)
        return img
    }
)

const file = state => get(state, 'cryptogram.file', [])
export const fileSelector = createSelector(file, f => f)

const imageDescription = state => get(state, 'cryptogram.image.description', {})
export const imageDescriptionSelector = createSelector(imageDescription, i => i)