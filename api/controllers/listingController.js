import Listing from "../models/listingModel.js";
export const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.log(error);
  }
};
