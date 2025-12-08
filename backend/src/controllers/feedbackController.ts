import { Request, Response } from 'express';
import prisma from '../config/database';

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, tool_name } = req.body;

    // Validation
    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email and message are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Get user agent and IP
    const userAgent = req.get('user-agent') || null;
    const ipAddress = req.ip || req.socket.remoteAddress || null;

    // Save to database
    const feedback = await prisma.feedback.create({
      data: {
        name: name || null,
        email,
        subject: subject || null,
        message,
        toolName: tool_name || null,
        userAgent,
        ipAddress,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: feedback.id,
      },
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
    });
  }
};
