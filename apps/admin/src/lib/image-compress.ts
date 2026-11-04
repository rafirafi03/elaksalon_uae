import sharp from "sharp";

/** Longest side after resizing. Plenty for full-width hero/detail images. */
const MAX_SIDE = 1600;

export type CompressedImage = { buffer: Buffer; contentType: string; ext: string };

/**
 * Resizes (never enlarges) and converts uploads to WebP so pages load fast and the
 * Next.js image optimizer doesn't time out on multi‑MB originals. GIFs are kept as-is (animation).
 * Falls back to the original bytes if the image can't be processed.
 */
export async function compressImage(input: ArrayBuffer | Buffer, contentType: string): Promise<CompressedImage> {
  const original = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const fallbackExt = contentType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  if (contentType === "image/gif") return { buffer: original, contentType, ext: "gif" };

  try {
    const buffer = await sharp(original)
      .rotate() // respect EXIF orientation from phone photos
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    // Keep the original if it was already smaller (e.g. a tiny optimized PNG).
    return buffer.length < original.length
      ? { buffer, contentType: "image/webp", ext: "webp" }
      : { buffer: original, contentType, ext: fallbackExt };
  } catch {
    return { buffer: original, contentType, ext: fallbackExt };
  }
}
