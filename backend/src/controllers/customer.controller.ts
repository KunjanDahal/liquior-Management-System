import { Request, Response } from 'express';
import { CustomerService, CreateCustomerRequest, UpdateCustomerRequest } from '../services/customer.service';
import { logger } from '../utils/logger';

// Create a single instance of Customer service
let customerService: CustomerService | null = null;

async function getCustomerService(): Promise<CustomerService> {
  if (!customerService) {
    customerService = await CustomerService.create();
  }
  return customerService;
}

/**
 * Get all customers with optional search
 * GET /api/customers?q=search&limit=100
 */
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = (req.query.q as string) || undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;

    const service = await getCustomerService();
    const customers = await service.getAllCustomers(search, limit);

    res.json({
      success: true,
      data: customers,
      count: customers.length,
    });
  } catch (error: any) {
    logger.error('Error getting customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customers',
      error: error.message,
    });
  }
};

/**
 * Get customer by ID
 * GET /api/customers/:id
 */
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid customer ID',
      });
      return;
    }

    const service = await getCustomerService();
    const customer = await service.getCustomerById(id);

    if (!customer) {
      res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
      return;
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    logger.error('Error getting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer',
      error: error.message,
    });
  }
};

/**
 * Create new customer
 * POST /api/customers
 */
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: CreateCustomerRequest = req.body;

    // Validation
    if (!data.FirstName || !data.LastName) {
      res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
      return;
    }

    if (!data.PhoneNumber && !data.EmailAddress) {
      res.status(400).json({
        success: false,
        message: 'Either phone number or email address is required',
      });
      return;
    }

    const service = await getCustomerService();
    const customer = await service.createCustomer(data);

    res.status(201).json({
      success: true,
      data: customer,
      message: 'Customer created successfully',
    });
  } catch (error: any) {
    logger.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message,
    });
  }
};

/**
 * Update existing customer
 * PUT /api/customers/:id
 */
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid customer ID',
      });
      return;
    }

    const data: UpdateCustomerRequest = { ...req.body, ID: id };

    const service = await getCustomerService();
    const customer = await service.updateCustomer(data);

    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully',
    });
  } catch (error: any) {
    logger.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message,
    });
  }
};

/**
 * Delete customer (soft delete)
 * DELETE /api/customers/:id
 */
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid customer ID',
      });
      return;
    }

    const service = await getCustomerService();
    await service.deleteCustomer(id);

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message,
    });
  }
};

/**
 * Get customer purchase history
 * GET /api/customers/:id/history
 */
export const getCustomerHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid customer ID',
      });
      return;
    }

    const service = await getCustomerService();
    const history = await service.getCustomerPurchaseHistory(id, limit);

    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error: any) {
    logger.error('Error getting customer history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer history',
      error: error.message,
    });
  }
};




