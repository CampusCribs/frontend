// import { useGetUsersMeThumbnailUpload } from "@/gen/hooks/UsersHooks/useGetUsersMeThumbnailUpload";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useState } from "react";

export function useThumbnailUpload() {
  const [mediaId, setMediaId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const config = useAuthenticatedClientConfig();

  // const { refetch } = useGetUsersMeThumbnailUpload({
  //   ...config,
  //   query: {
  //     enabled: false, // ✅ Must be inside query object
  //   },
  // });

  const upload = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const { data } = await refetch(); // call the actual endpoint
      if (!data) throw new Error("Failed to fetch upload URL");

      const {
        data: { uploadUrl, mediaId },
      } = data;

      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!res.ok) throw new Error("Upload failed");

      setMediaId(mediaId);
      return mediaId;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    upload,
    mediaId,
    uploading,
    error,
  };
}
