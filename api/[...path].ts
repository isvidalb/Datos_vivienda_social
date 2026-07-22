import "dotenv/config";
import { createApp } from "../server/_core/app";

// Vercel serverless entrypoint for everything under /api/* (tRPC, OAuth
// callback). Express apps are directly callable as (req, res), which is
// exactly the Node serverless function signature Vercel expects.
export default createApp();
