import Product from "../models/product.model.js";
import formidable from "formidable";
import {
  handleDeleteFile,
  handleFileUpload,
} from "../services/cloudinary.service.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
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

      const productData = {};

      const getFieldValue = (field) =>
        field && field[0] ? field[0] : undefined;

      if (fields.name) productData.name = getFieldValue(fields.name);
      if (fields.price)
        productData.price = parseInt(getFieldValue(fields.price));
      if (fields.discountPrice)
        productData.discountPrice = parseInt(
          getFieldValue(fields.discountPrice),
          0
        );
      if (fields.stock)
        productData.stock = parseInt(getFieldValue(fields.stock), 0);
      if (fields.gender) productData.gender = getFieldValue(fields.gender);
      if (fields.description)
        productData.description = getFieldValue(fields.description);
      if (fields.brand) {
        const brandId = getFieldValue(fields.brand);
        const brand = await Brand.findById(brandId);
        if (!brand) {
          return res.status(404).json({
            success: false,
            message: "Brand Does not Exist",
          });
        }
        productData.brand = brandId;
      }
      if (fields.category) {
        const categoryId = getFieldValue(fields.category);
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({
            success: false,
            message: "Category Does not Exist",
          });
        }
        productData.category = categoryId;
      }

      if (fields.sizes) {
        const updatedSizes = [...product.sizes];
        const newSizes = getFieldValue(fields.sizes)
          .split(",")
          .map((s) => s.trim());
        newSizes.forEach((size) => {
          if (!updatedSizes.includes(size)) {
            updatedSizes.push(size);
          }
        });
        productData.sizes = updatedSizes;
      }

      if (newImages.length > 0) {
        productData.$push = { images: { $each: newImages } };
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        productData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("brand category");

      return res.status(200).json({ success: true, updatedProduct });
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
