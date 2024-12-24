import { promises as fs } from 'fs';
import path from 'path';

const customerFilePath = path.resolve(process.cwd(), 'customer.json');

export const getCustomerEmails = async (): Promise<string[]> => {
  try {
    const data = await fs.readFile(customerFilePath, 'utf-8');
    const customers = JSON.parse(data);
    return customers.emails || [];
  } catch (error) {
    console.error('Error reading customer.json:', error);
    return [];
  }
};
