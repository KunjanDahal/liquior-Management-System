import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const router = Router();
const inventoryController = new InventoryController();

// Item CRUD routes
router.get('/items', inventoryController.getItems);
router.get('/items/:id', inventoryController.getItemById);
router.post('/items', inventoryController.createItem);
router.put('/items/:id', inventoryController.updateItem);
router.delete('/items/:id', inventoryController.deleteItem);

// Inventory operations
router.post('/adjust', inventoryController.adjustInventory);
router.post('/transfer', inventoryController.transferInventory);
router.post('/bulk-price-update', inventoryController.bulkUpdatePrices);

// Inventory reporting
router.get('/low-stock', inventoryController.getLowStockItems);
router.get('/value', inventoryController.getInventoryValue);

// Reference data
router.get('/categories', inventoryController.getCategories);
router.get('/departments', inventoryController.getDepartments);
router.get('/suppliers', inventoryController.getSuppliers);

export default router;

