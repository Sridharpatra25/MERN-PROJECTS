import { getShortUrl } from "../dao/short_url.js";
import { shortUrlWithOutUser } from "../services/short_url.service.js";
import shortUrl from "../models/shorturl.models.js";
import wrapAsync from "../utils/tryCatchWrapper.js";

export const createShortUrl = wrapAsync(async (req, res) => {
    const { url } = req.body;
    const shortUrl = await shortUrlWithOutUser(url);
    res.send(shortUrl);

});
export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);
  res.redirect(url.full_url);
});
