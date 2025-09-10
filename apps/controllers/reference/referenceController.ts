import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index';

const prisma = new PrismaClient();

export class ReferenceController {
  // Get all interests
  async getInterests(req: Request, res: Response) {
    try {
      const interests = await prisma.interest.findMany({
        orderBy: { label: 'asc' }
      });

      res.json({
        success: true,
        message: 'Interests retrieved successfully',
        data: { interests }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve interests',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all travel styles
  async getTravelStyles(req: Request, res: Response) {
    try {
      const travelStyles = await prisma.travelStyle.findMany({
        orderBy: { label: 'asc' }
      });

      res.json({
        success: true,
        message: 'Travel styles retrieved successfully',
        data: { travelStyles }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve travel styles',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get interests by keys (for validation)
  async getInterestsByKeys(req: Request, res: Response) {
    try {
      const { keys } = req.body;
      
      if (!keys || !Array.isArray(keys)) {
        return res.status(400).json({
          success: false,
          message: 'Keys array is required'
        });
      }

      const interests = await prisma.interest.findMany({
        where: {
          key: { in: keys }
        }
      });

      res.json({
        success: true,
        message: 'Interests found',
        data: { interests }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve interests',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get travel styles by keys (for validation)
  async getTravelStylesByKeys(req: Request, res: Response) {
    try {
      const { keys } = req.body;
      
      if (!keys || !Array.isArray(keys)) {
        return res.status(400).json({
          success: false,
          message: 'Keys array is required'
        });
      }

      const travelStyles = await prisma.travelStyle.findMany({
        where: {
          key: { in: keys }
        }
      });

      res.json({
        success: true,
        message: 'Travel styles found',
        data: { travelStyles }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve travel styles',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new ReferenceController();
