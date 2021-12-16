const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");
// UPDATE: Added { restore } const to this file (on product-routes.js and category-routes.js)
const { restore } = require("../../models/Tags");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

/* 
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes! 
*/

/*
        category_name: req.body.category_name,
        key(description, for example): req.body.description,
      
        OTHER EXAMPLES:
        dish_name: req.body.dish_name,
        description: req.body.description,
        guest_name: req.body.guest_name,
        has_nuts: req.body.has_nuts,

         /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

router.post("/", (req, res) => {
  // create a new tag
});

/* 
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes! 
*/
router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
