"use client";
/**
 * Shrink a phone photo before uploading (prescriptions): long side ≤ 1600 px,
 * JPEG ~0.82. A 5 MB camera photo becomes ~300 kB — much faster on mobile data,
 * and still sharp enough to read a prescription.
 */
export async function shrinkImage(file, maxSide = 1600, quality = 0.82) {
  if (!file || !file.type?.startsWith("image/")) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 900 * 1024) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", quality));
    return blob ? new File([blob], "prescription.jpg", { type: "image/jpeg" }) : file;
  } catch { return file; }
}
