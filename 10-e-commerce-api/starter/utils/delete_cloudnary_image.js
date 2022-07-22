const cloudinary = require("cloudinary").v2;

//Returns Cloudinary Public Id//
const getPublic_id = (str) => {
  try {
    const public_id_arr = str.split("upload/v")[1].split("/");
    let public_id = "";

    for (let i = 1; i < public_id_arr.length; i++) {
      public_id += public_id_arr[i] + "/";
    }

    return public_id.split(".")[0];
  } catch (error) {}
};

const deleteCloudinanyImage = async (url) => {
  try {
    await cloudinary.uploader.destroy(getPublic_id(url));
  } catch (error) {}
};

module.exports = deleteCloudinanyImage;
