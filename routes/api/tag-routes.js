const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// GET all tags, including associated Product data
router.get("/", async (req, res) => {
  // Updated code
  try {
    const tagData = await Tag.findAll({
      // Add Product as a second model to JOIN with
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

// GET a single tag, including associated Product data
router.get("/:id", async (req, res) => {
  // (Updated code)
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with that ID" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

// CREATE a new tag -- DOES NOT USE ASYNC DUE TO PRE-EXISTING CODE
/* 
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes! 
*/
// Code imported from product-routes.js
router.post("/", (req, res) => {
  Tag.create(
    // (Updated code)
    {
      tag_name: req.body.tag_name,
      // Don't need to add productIds as a line due to ? in "if" statement
    }
    // (Updated code ends here)
  )
    // (Imported/modified product-routes code begins here)
    .then((tag) => {
      // If multiple producs are associated with this tag: We need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds?.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If no association with multiple products, just respond with the tag
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  // (Imported/modified product-routes code ends here)
});

// UPDATE a tag -- DOES NOT USE ASYNC DUE TO PRE-EXISTING CODE
/* 
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes! 
*/
// Code imported from product-routes.js
router.put("/:id", (req, res) => {
  Tag.update(
    // (Updated code)
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
    // (Updated code ends here)
  )
    // (Imported/modified product-routes code begins here)
    .then((tag) => {
      // Find all associated products from ProductTag
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      // Get list of current product_ids
      const productTagIds = productTags.map(({ product_id }) => product_id);
      // Create filtered list of new product_ids
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // Figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
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
  // (Imported/modified product-routes code ends here)
});

// DELETE a tag using its ID value
router.delete("/:id", async (req, res) => {
  // (Updated code)
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with that ID" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

module.exports = router;
