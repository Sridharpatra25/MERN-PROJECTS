import UrlSchema from "../models/shorturl.models.js";
import { ConflictError } from "../utils/errorHandler.js";
export const saveShortUrl = async (shortUrl,  longUrl, userId)=>{
  try {
    const newUrl = new UrlSchema({
      full_url: longUrl,
      short_url: shortUrl,
    });
    if(userId){
      newUrl.user_id = userId;
    }

    await newUrl.save();
  } catch (error) {
    if(error.code ==11000){
      throw new ConflictError("Short url already exist")
    }
    throw new Error(error)
  }
      

}

export const getShortUrl=async (shortUrl)=>{
  return await UrlSchema.findOneAndUpdate({short_url:shortUrl},{$inc:{clicks:1}})
}