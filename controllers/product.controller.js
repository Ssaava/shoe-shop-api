import Product from "../models/product.model.js";
import formidable from "formidable";
import {
  handleDeleteFile,
  handleFileUpload,
} from "../services/cloudinary.service.js";

export const registerProduct = async (req, res) => {
  const form = formidable({});
  let uploadedImages = [];
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to Upload product Image",
        error: err.message,
      });
    }

    try {
      if (
        !fields.name ||
        !fields.price ||
        !fields.stock ||
        !fields.brand ||
        !fields.category
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields (name, price, stock, brand, or category)",
        });
      }
      if (!files.file) {
        return res.status(400).json({
          success: false,
          message: "No Images were added for the product",
        });
      }
      for (const file of files.file) {
        console.log("Image path: ", file.filepath);
        const response = await handleFileUpload(file.filepath);
        uploadedImages.push({
          url: response.secure_url,
          image_id: response.asset_id,
          public_id: response.public_id,
        });
      }

      const productData = {
        name: fields.name[0], // Access first element of array
        price: parseFloat(fields.price[0]),
        discountPrice: fields.discountPrice
          ? parseFloat(fields.discountPrice[0])
          : undefined,
        stock: parseInt(fields.stock[0], 10),
        gender: fields.gender ? fields.gender[0] : "both",
        description: fields.description ? fields.description[0] : "",
        sizes: fields.sizes ? fields.sizes[0].split(",") : [],
        brand: fields.brand[0],
        category: fields.category[0],
        images: uploadedImages,
      };

      const product = new Product(productData);
      await product.save();
      return res.status(200).json({
        success: true,
        message: "Product Registered successfully",
        product,
      });
    } catch (error) {
      console.error("Upload error:", error);
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          await handleDeleteFile(image.public_id || image.asset_id);
        }
      }
      return res.status(500).json({
        success: false,
        message: "Error uploading some files",
        error: error.message,
      });
    }
  });
};

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().populate("brand category");
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching the product", error: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product Id Not Found",
      });
    }

    const product = await Product.findById(productId).populate(
      "brand category"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching the product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to Upload product Image",
        error: err.message,
      });
    }
    let newImages = [];
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product Not Found",
        });
      }

      if (files.file) {
        for (const file of files.file) {
          const response = await handleFileUpload(file.filepath);
          newImages.push({
            url: response.secure_url,
            image_id: response.asset_id,
            public_id: response.public_id,
          });
        }
      }

      let updatedSizes = [...product.sizes];
      if (fields.sizes && fields.sizes[0]) {
        const newSizes = fields.sizes[0].split(",");
        newSizes.forEach((size) => {
          if (!updatedSizes.includes(size.trim())) {
            updatedSizes.push(size.trim());
          }
        });
      }

      const productData = {
        name: fields.name[0],
        price: parseFloat(fields.price[0]),
        discountPrice: fields.discountPrice
          ? parseFloat(fields.discountPrice[0])
          : undefined,
        stock: parseInt(fields.stock[0], 10),
        gender: fields.gender ? fields.gender[0] : "both",
        description: fields.description ? fields.description[0] : "",
        sizes: updatedSizes,
        brand: fields.brand[0],
        category: fields.category[0],
        ...(newImages.length > 0 && {
          images: [...product.images, ...newImages],
        }),
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: productData },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });
      res
        .status(200)
        .json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      console.error("Update error:", error);
      if (newImages.length > 0) {
        for (const image of newImages) {
          await handleDeleteFile(image.public_id || image.asset_id);
        }
      }
      return res.status(500).json({
        success: false,
        message: "Error updating product data",
        error: error.message,
      });
    }
  });
};

export const removeProductImage = async (req, res) => {
  const { productId } = req.params;
  const { publicIds } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Image Not Found",
      });
    }
    const deletionResults = await Promise.allSettled(
      publicIds.map((publicId) => handleDeleteFile(publicId))
    );

    const failedDeletions = deletionResults
      .filter(
        (result) =>
          result.status === "rejected" || result.value?.result !== "ok"
      )
      .map((result, index) => ({
        publicId: publicIds[index],
        message: result.reason?.message || "Unknown Error Occurred",
      }));

    let failedDeletionsMessage = {};
    if (failedDeletions.length > 0) {
      failedDeletionsMessage = {
        success: false,
        message: "Some images failed to delete",
        failedDeletions,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $pull: { images: { public_id: { $in: publicIds } } } },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({
      success: true,
      message: "Product Image removed successfully",
      updatedProduct,
      failedImages: failedDeletionsMessage,
    });
  } catch (error) {
    console.log("Remove Product Error: ".error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Product Image",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product Id Not Found",
      });
    }

    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    for (const image of product.images) {
      await handleDeleteFile(image.public_id || image.asset_id);
    }

    res.status(200).json({ message: "Product deleted", product: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
