const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const IMAGE_MIME = /^image\/(png|jpeg|jpg|webp|gif|avif)$/;
const FILE_MIME =
  /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/;

export type UploadAssetKind = "image" | "file";

export type UploadValidation =
  { ok: true; filename: string; contentType: string; bytes: Buffer } | { ok: false; error: string };

/**
 * Validates one upload before it reaches Sanity: name length, MIME allowlist,
 * base64 decoding and the 8 MB cap. Pure so it can be unit-tested.
 */
export function validateUpload(
  kind: UploadAssetKind,
  filenameRaw: unknown,
  contentTypeRaw: unknown,
  base64Raw: unknown,
): UploadValidation {
  const contentType = typeof contentTypeRaw === "string" ? contentTypeRaw : "";
  const filename = typeof filenameRaw === "string" ? filenameRaw.trim() : "";
  const base64 = typeof base64Raw === "string" ? base64Raw : "";

  if (!filename || filename.length > 200) {
    return { ok: false, error: "That file name cannot be used." };
  }
  if (!base64) return { ok: false, error: "No file data was received." };

  const pattern = kind === "image" ? IMAGE_MIME : FILE_MIME;
  if (!pattern.test(contentType.toLowerCase())) {
    return {
      ok: false,
      error:
        kind === "image"
          ? "Choose a PNG, JPEG, WebP, GIF or AVIF image."
          : "Choose a PDF or Word document.",
    };
  }

  let bytes: Buffer;
  try {
    bytes = Buffer.from(base64, "base64");
  } catch {
    return { ok: false, error: "That file could not be read." };
  }
  if (bytes.byteLength === 0) return { ok: false, error: "That file is empty." };
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Files must be 8 MB or smaller." };
  }
  return { ok: true, filename, contentType, bytes };
}
