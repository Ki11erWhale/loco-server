import { NextFunction, Request, Response } from 'express';
import { getCustomerEmails } from '../utils/customer';

export const verifyCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email as string;

  const customerEmails = await getCustomerEmails();
  if (!customerEmails.includes(email)) {
    res.status(200).json({
      success: false,
      message: '구매자만 이용할 수 있습니다.',
    });

    return;
  }

  next();
};
