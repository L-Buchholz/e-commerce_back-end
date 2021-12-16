const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

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
