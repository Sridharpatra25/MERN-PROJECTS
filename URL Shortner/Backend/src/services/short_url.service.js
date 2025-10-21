import { generateNanoId } from "../utils/helper.js";
import UrlSchema from '../models/shorturl.models.js'
import {saveShortUrl} from '../dao/short_url.js'
import shortUrl from "../models/shorturl.models.js";

export const shortUrlWithOutUser = async (url)=>{
   const shortUrl = generateNanoId(7)
   if(!shortUrl) throw new Error("Short url not generated")
   
    await saveShortUrl(shortUrl, url)

    return shortUrl
}
export const shortUrlWithUser = async (url,userId)=>{
   const shortUrl = generateNanoId(7)

    await saveShortUrl(shortUrl,url,userId)

    return shortUrl
}