const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");
const { restore } = require("../../models/Product");

// The `/api/products` endpoint

// GET all products, including associated Categories and Tags
router.get("/", async (req, res) => {
  // (Updated code)
  try {
    const productData = await Product.findAll({
      // Add Category and Tag as second models to JOIN with
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

// GET a single product, including associated Category and Tag data
router.get("/:id", async (req, res) => {
  // (Updated code)
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      res.status(404).json({ message: "No product found with that ID" });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

// CREATE a new product -- DOES NOT USE ASYNC DUE TO PRE-EXISTING CODE
/* 
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes! 
*/
router.post("/", (req, res) => {
  Product.create(
    // (Updated code)
    {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    }
    // (Updated code ends here)
  )
    .then((product) => {
      // If product tags are present: We need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If no product tags, just respond with the product
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE a product -- DOES NOT USE ASYNC DUE TO PRE-EXISTING CODE
/* 
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes! 
*/
router.put("/:id", (req, res) => {
  // Updates product data
  Product.update(
    {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((product) => {
      // Find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // Get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // Create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // Figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // Run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE a product using its ID value
router.delete("/:id", async (req, res) => {
  // (Updated code)
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productData) {
      res.status(404).json({ message: "No product found with that ID" });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

module.exports = router;
