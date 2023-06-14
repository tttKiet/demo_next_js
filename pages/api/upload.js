import { createRouter } from "next-connect";
import { uploadClound } from "@/utils/cloundiary";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const router = createRouter();

router.use(uploadClound.any()).post(async (req, res) => {
  await mongooseConnect();
  await isAdminRequest(req, res);
  res.json({
    links: req.files.map((file) => file.filename),
  });
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
