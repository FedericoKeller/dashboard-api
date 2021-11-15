import { Router, Request, Response } from 'express';
import * as AuthController from '../controllers/auth.controller';

export const authRoutes = Router();

authRoutes.post("/login", AuthController.login);
