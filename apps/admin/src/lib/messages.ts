/** User-facing copy only — never surface raw infra / DB errors. */

export const MSG = {
  loadFailed: "We couldn’t load this right now. Please try again.",
  saveFailed: "We couldn’t save your changes. Please try again.",
  deleteFailed: "We couldn’t delete this item. Please try again.",
  unavailable: "This page isn’t available right now. Please try again later.",
  notFound: "We couldn’t find what you’re looking for.",
  uploadFailed: "Image upload failed. Try another file.",
  uploadChoose: "Choose an image to upload.",
  uploadType: "Please use a JPG, PNG, WEBP, or GIF image.",
  uploadSize: "Please choose an image under 5MB.",
} as const;

export function logAdminError(scope: string, error: unknown) {
  console.error(`[admin:${scope}]`, error);
}
