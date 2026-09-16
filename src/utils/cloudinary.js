const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";

function safePositiveInt(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
  return Math.round(numeric);
}

/**
 * Adds Cloudinary delivery transformations without changing non-Cloudinary URLs.
 * This keeps the original upload untouched and only changes the delivered variant.
 */
export function optimizeCloudinaryImage(
  url,
  {
    width = 800,
    height = null,
    crop = "limit",
    quality = "auto:eco",
  } = {}
) {
  if (typeof url !== "string" || !url) return url;

  if (
    !url.includes("res.cloudinary.com") ||
    !url.includes(CLOUDINARY_UPLOAD_MARKER)
  ) {
    return url;
  }

  const transforms = ["f_auto", `q_${quality}`];
  const finalWidth = safePositiveInt(width, null);
  const finalHeight = safePositiveInt(height, null);

  if (crop) transforms.push(`c_${crop}`);
  if (finalWidth) transforms.push(`w_${finalWidth}`);
  if (finalHeight) transforms.push(`h_${finalHeight}`);

  return url.replace(
    CLOUDINARY_UPLOAD_MARKER,
    `${CLOUDINARY_UPLOAD_MARKER}${transforms.join(",")}/`
  );
}

export function cloudinaryCardImage(url) {
  return optimizeCloudinaryImage(url, {
    width: 720,
    height: 448,
    crop: "fill",
    quality: "auto:eco",
  });
}

export function cloudinaryListImage(url) {
  return optimizeCloudinaryImage(url, {
    width: 360,
    height: 280,
    crop: "fill",
    quality: "auto:eco",
  });
}

export function cloudinaryDetailImage(url) {
  return optimizeCloudinaryImage(url, {
    width: 1600,
    height: 1000,
    crop: "limit",
    quality: "auto:good",
  });
}

export function cloudinaryZoomImage(url) {
  return optimizeCloudinaryImage(url, {
    width: 2200,
    height: 1600,
    crop: "limit",
    quality: "auto:good",
  });
}

export function cloudinaryOgImage(url) {
  return optimizeCloudinaryImage(url, {
    width: 1200,
    height: 630,
    crop: "fill",
    quality: "auto:good",
  });
}
