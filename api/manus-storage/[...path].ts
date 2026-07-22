import "dotenv/config";
import { createApp } from "../../server/_core/app";

// Real location of the function backing the public "/manus-storage/*" path
// (see vercel.json rewrites and server/_core/storageProxy.ts).
export default createApp();
