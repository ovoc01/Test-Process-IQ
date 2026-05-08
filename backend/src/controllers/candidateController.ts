import { Request, Response, NextFunction } from 'express';
import Candidate, { CandidateStatus } from '../models/Candidate';
import { createCandidateSchema, updateCandidateSchema } from '../utils/validation';
import { AppError } from '../middleware/errorMiddleware';
import { generateCandidatePDF } from '../utils/pdfGenerator';
import logger from '../utils/logger';

export const createCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCandidateSchema.parse(req.body);
    const candidate = await Candidate.create(validatedData);
    res.status(201).json(candidate);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error';
      return next(new AppError(message, 400));
    }
    if (error.code === 11000) {
      return next(new AppError('Email already exists', 400));
    }
    next(error);
  }
};

export const getCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const query: any = { isDeleted: false };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const candidates = await Candidate.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Candidate.countDocuments(query);

    res.status(200).json({
      candidates,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new AppError('Candidate not found', 404));
    }
    res.status(200).json(candidate);
  } catch (error) {
    next(error);
  }
};

export const updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateCandidateSchema.parse(req.body);
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!candidate) {
      return next(new AppError('Candidate not found', 404));
    }

    res.status(200).json(candidate);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error';
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

export const deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!candidate) {
      return next(new AppError('Candidate not found', 404));
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const validateCandidate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new AppError('Candidate not found', 404));
    }

    logger.info(`Starting async validation for candidate ${candidate._id}`);
    
    // Simulated 2s delay
    setTimeout(async () => {
      try {
        candidate.status = CandidateStatus.VALIDATED;
        await candidate.save();
        logger.info(`Candidate ${candidate._id} validated successfully after delay`);
      } catch (err) {
        logger.error(`Error during delayed validation for ${candidate._id}: ${err}`);
      }
    }, 2000);

    res.status(202).json({ message: 'Validation in progress' });
  } catch (error) {
    next(error);
  }
};

export const getCandidateReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new AppError('Candidate not found', 404));
    }

    const pdfBuffer = await generateCandidatePDF(candidate);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${candidate.lastName}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
