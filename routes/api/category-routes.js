const router = require("express").Router();
const { Category, Product } = require("../../models");
const { restore } = require("../../models/Category");

// The `/api/categories` endpoint

// GET all categories, inc. associated Products
router.get("/", async (req, res) => {
  // (Updated code)
  try {
    const categoryData = await Category.findAll({
      // Add Product as a second model to JOIN with
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

// GET a single category, inc. associated Product[s]
router.get("/:id", async (req, res) => {
  // (Updated code)
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category found with that ID" });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

// CREATE a new category
/*
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes!
*/
router.post("/", async (req, res) => {
  // (Updated code)
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
  // (Updated code ends here)
});

// UPDATE a category using its ID value
/* 
Use your model's column definitions to figure out what req.body 
will be for POST and PUT routes! 
*/
router.put("/:id", async (req, res) => {
  // (Updated code)
  try {
    const categoryData = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

// DELETE a category using its ID value
router.delete("/:id", async (req, res) => {
  // (Updated code)
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category found with that ID" });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  // (Updated code ends here)
});

module.exports = router;
