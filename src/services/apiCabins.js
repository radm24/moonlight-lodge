import supabase from "./supabase";
import { CABIN_IMAGES_PATH } from "../utils/constants";
import { RESERVED_CABIN_IMAGES } from "../utils/constants";

const getImageNameFromPath = (image) => image.replace(CABIN_IMAGES_PATH, "");

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    throw new Error("Cabin not found");
  }

  return data;
}

export async function createUpdateCabin({
  maxCapacity: max_capacity,
  regularPrice: regular_price,
  ...fields
}) {
  const cabinData = { ...fields, max_capacity, regular_price };

  const isEditMode = Boolean(cabinData.id);

  let oldImageName, newImageName, newImagePath;
  let query = supabase.from("cabins");

  // 1. Check if a new image is added
  const isNewImageAdded = typeof cabinData.image === "object";
  if (isNewImageAdded) {
    // 1.1. Get old image in edit mode
    if (isEditMode) {
      const { data: oldImageData, error: oldImageFetchError } = await query
        .select("image")
        .eq("id", cabinData.id)
        .single();

      if (oldImageFetchError) {
        console.log(oldImageFetchError);
        throw new Error("Cabin could not be updated");
      }

      oldImageName = getImageNameFromPath(oldImageData.image);
    }

    // 1.2. Upload a new image
    newImageName = `${Math.random()}-${cabinData.image.name}`.replaceAll(
      "/",
      ""
    );
    newImagePath = CABIN_IMAGES_PATH + newImageName;

    const { error: imageUploadError } = await supabase.storage
      .from("cabin-images")
      .upload(newImageName, cabinData.image);

    if (imageUploadError) {
      console.log(imageUploadError);
      throw new Error(
        isEditMode
          ? "Cabin could not be updated"
          : "Cabin image could not be uploaded and the cabin was not created"
      );
    }
  }

  // 2. Create cabin / Update cabin data
  if (newImagePath) cabinData.image = newImagePath;

  if (!isEditMode) query = query.insert([cabinData]);

  if (isEditMode) query = query.update(cabinData).eq("id", cabinData.id);

  const { data, error } = await query.select().single();

  if (error) {
    await supabase.storage.from("cabin-images").remove([newImageName]);
    console.log(error);
    throw new Error(
      isEditMode ? "Cabin could not be updated" : "Cabin could not be added"
    );
  }

  // 3. Remove old image in edit mode
  if (isEditMode && isNewImageAdded) {
    const isReservedImage = RESERVED_CABIN_IMAGES.some(
      (resImage) => resImage === oldImageName
    );

    if (!isReservedImage)
      await supabase.storage.from("cabin-images").remove([oldImageName]);
  }

  return data;
}

export async function deleteCabin(id) {
  // 1. Get cabin's image path
  const { data: imageData, error: imageFetchError } = await supabase
    .from("cabins")
    .select("image")
    .eq("id", id)
    .single();

  if (imageFetchError) {
    console.log(imageFetchError);
    throw new Error("Cabin could not be deleted");
  }

  // 2. Delete the cabin
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be deleted");
  }

  // 3. Delete the image
  const imageName = getImageNameFromPath(imageData.image);
  const isReservedImage = RESERVED_CABIN_IMAGES.some(
    (resImage) => resImage === imageName
  );
  if (isReservedImage) return null;

  const { error: imageDeleteError } = await supabase.storage
    .from("cabin-images")
    .remove([imageName]);

  if (imageDeleteError) {
    console.log(imageDeleteError);
  }

  return null;
}

export async function duplicateCabin(id) {
  try {
    // 1. Get cabin data
    const cabin = await getCabin(id);

    // 2. Copy image
    const imageName = getImageNameFromPath(cabin.image);
    // Image name format is Math.random()-image_name.file_extension
    const copyImageName = imageName.replace(/[^-]*/, Math.random());

    const { data: imageData, error: imageCopyError } = await supabase.storage
      .from("cabin-images")
      .copy(imageName, copyImageName);

    if (imageCopyError) throw imageCopyError;

    const copyImagePath =
      CABIN_IMAGES_PATH + imageData.path.replace("cabin-images/", "");

    // 3. Copy cabin
    const copyCabin = (({
      name,
      max_capacity: maxCapacity,
      regular_price: regularPrice,
      discount,
      description,
    }) => ({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      description,
      image: copyImagePath,
    }))(cabin);

    try {
      const data = await createUpdateCabin(copyCabin);
      return data;
    } catch (err) {
      await supabase.storage.from("cabin-images").remove([copyImageName]);
      throw err;
    }
  } catch (err) {
    console.log(err);
    throw new Error("Cabin could not be created");
  }
}
