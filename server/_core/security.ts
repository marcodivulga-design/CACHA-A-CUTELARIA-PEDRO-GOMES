import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

// 1. CORS Configuration
export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

// 2. Helmet Security Headers
export function setupHelmet() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.stripe.com', 'https://api.pix.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        frameSrc: ["'self'", 'https://js.stripe.com'],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,
    xssFilter: true,
  });
}

// 3. Rate Limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each user to 10 payment attempts per hour
  keyGenerator: (req) => req.user?.id || req.ip,
});

// 4. Input Validation & Sanitization
export function validateInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize and validate all inputs
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === 'string') {
      // Remove potential XSS
      req.body[key] = req.body[key]
        .replace(/[<>]/g, '')
        .trim();
    }
  });

  next();
}

// 5. CSRF Protection
export function generateCSRFToken(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCSRFToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.session?.csrfToken;

  if (!token || token !== sessionToken) {
    return res.status(403).json({ error: 'CSRF token validation failed' });
  }

  next();
}

// 6. SQL Injection Prevention
export function preventSQLInjection(req: Request, res: Response, next: NextFunction) {
  const sqlKeywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'SELECT', 'UNION'];
  
  Object.values(req.body).forEach((value) => {
    if (typeof value === 'string') {
      const upperValue = value.toUpperCase();
      if (sqlKeywords.some(keyword => upperValue.includes(keyword))) {
        return res.status(400).json({ error: 'Invalid input detected' });
      }
    }
  });

  next();
}

// 7. API Key Validation
export function validateAPIKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}

// 8. Request Logging & Monitoring
export function logRequest(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}

// 9. Error Handling & Logging
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't expose internal error details to client
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id,
  });
}

// 10. Session Security
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    sameSite: 'strict' as const, // Prevent CSRF
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// 11. Two-Factor Authentication
export function generateTOTPSecret(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('base64');
}

export function verifyTOTPCode(secret: string, code: string): boolean {
  // Implementation using speakeasy or similar library
  // This is a placeholder
  return true;
}

// 12. Encryption Utilities
export function encryptSensitiveData(data: string): string {
  const crypto = require('crypto');
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptSensitiveData(encrypted: string): string {
  const crypto = require('crypto');
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 13. Permission Checking
export function checkPermission(requiredPermission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.permissions?.includes(requiredPermission)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
}

// 14. Audit Logging
export async function auditLog(
  userId: string,
  action: string,
  resource: string,
  details: any
) {
  console.log({
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource,
    details,
  });
  
  // In production, save to database or external service
}

// 15. Security Headers Middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}
