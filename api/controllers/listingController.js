import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";
import Fuse from "fuse.js";
export const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    next(error);
  }
};
export const deleteUserListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(403, "You can delete only your listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(403, "You can delete only your listing"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listings = await Listing.findById(req.params.id).populate(
      "userRef",
      "-password"
    );
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  //let { searchTerm, offer, type, parking, furnished, sort, order } = req.query;
  //console.log(searchTerm, offer, type, parking, furnished, sort, order);
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  try {
    //offer, furnished, parking, và type là các trường mà người dùng có thể lọc. Nếu không có giá trị nào được cung cấp, mặc định sẽ tìm kiếm tất cả các giá trị ($in: [false, true] hoặc $in: ['sale', 'rent']).
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    let listings = await Listing.find({
      offer,
      furnished,
      parking,
      type,
    }).sort({ [sort]: order });
    if (searchTerm) {
      const fuse = new Fuse(listings, {
        keys: ["name", "description", "address"],
        includeScore: true,
        threshold: 0.3,
      });
      const result = fuse.search(searchTerm);
      listings = result
        .filter((item) => item.score <= 0.3)
        .map((item) => item.item)
        .slice(startIndex, startIndex + limit);
    }
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
