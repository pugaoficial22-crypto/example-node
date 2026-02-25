var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Laptop', stock: 10 },
    { id: 2, name: 'Mouse', stock: 50 }
  ])
})

// Nuevo endpoint - buscar item por id
router.get('/:id', (req, res) => {
  const items = [
    { id: 1, name: 'Laptop', stock: 10 },
    { id: 2, name: 'Mouse', stock: 50 }
  ];

  const item = items.find(i => i.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }

  res.status(200).json(item);
});

module.exports = router
