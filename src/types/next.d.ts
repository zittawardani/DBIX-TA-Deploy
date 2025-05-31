// types/next.d.ts
import { File } from "multer";

declare module "next" {
  interface NextApiRequest {
    file?: File;
    files?: File[];
  }
}
