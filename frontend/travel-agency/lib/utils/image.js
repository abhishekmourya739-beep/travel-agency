export function getOptimizedImageUrl(url, width = 900, height = 700) {
  if (!url) return "";

  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace(
      "/upload/",
      `/upload/f_auto,q_auto,dpr_auto,c_fill,w_${width},h_${height}/`,
    );
  }

  return url;
}
