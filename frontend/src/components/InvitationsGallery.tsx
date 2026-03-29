import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { Play, Plus, Pencil, Trash2 } from "lucide-react";

interface InvitationVideo {
  id: string;
  videoSrc: string;
  thumbnail?: string;
  title?: string;
  clientName?: string;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const InvitationsGallery = () => {
  const { isAdmin } = useAdmin();
  const [videos, setVideos] = useState<InvitationVideo[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "invitationVideos"));
      const loaded: InvitationVideo[] = [];
      snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as InvitationVideo));
      // sort by id
      loaded.sort((a, b) => a.id.localeCompare(b.id));
      setVideos(loaded);
    } catch (e) {
      console.error("Error loading invitation videos:", e);
    }
  };

  const uploadToBackend = async (file: File): Promise<{ url: string; thumbnail: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BACKEND_URL}/api/upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Upload failed");
    return { url: data.file.url, thumbnail: data.file.thumbnail || data.file.url };
  };

  const handleAddVideo = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const { url, thumbnail } = await uploadToCloudinary(file);
        const title = prompt("Video title (e.g. Rahul & Priya Wedding Invitation):", "") || "";
        const clientName = prompt("Client name:", "") || "";
        const newId = `inv-${Date.now()}`;
        const data: InvitationVideo = { id: newId, videoSrc: url, thumbnail, title, clientName };
        await setDoc(doc(db, "invitationVideos", newId), { videoSrc: url, thumbnail, title, clientName });
        setVideos((prev) => [...prev, data]);
      } catch (err) {
        alert("Upload failed: " + err);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await setDoc(doc(db, "invitationVideos", id), { deleted: true }, { merge: true });
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("Delete failed: " + err);
    }
  };

  const handleEditDetails = async (video: InvitationVideo) => {
    const title = prompt("Video title:", video.title || "") ;
    if (title === null) return;
    const clientName = prompt("Client name:", video.clientName || "");
    if (clientName === null) return;
    try {
      await setDoc(doc(db, "invitationVideos", video.id), { title, clientName }, { merge: true });
      setVideos((prev) => prev.map((v) => v.id === video.id ? { ...v, title, clientName } : v));
    } catch (err) {
      alert("Update failed: " + err);
    }
  };

  const handlePlay = (id: string) => {
    // pause previously playing
    if (playingId && playingId !== id) {
      videoRefs.current[playingId]?.pause();
    }
    setPlayingId(id);
    videoRefs.current[id]?.play();
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 pb-16">
      {/* Admin Add Button */}
      {isAdmin && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAddVideo}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-poppins text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
          >
            <Plus size={18} />
            {uploading ? "Uploading..." : "Add Invitation Video"}
          </button>
        </div>
      )}

      {/* Empty state */}
      {videos.length === 0 && !isAdmin && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-poppins text-sm">Videos coming soon...</p>
        </div>
      )}

      {/* Video Grid — portrait cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {videos.map((video) => (
          <div key={video.id} className="relative group flex flex-col">
            {/* Portrait video card */}
            <div
              className="relative overflow-hidden rounded-lg bg-black cursor-pointer"
              style={{ aspectRatio: "9/16" }}
              onClick={() => handlePlay(video.id)}
            >
              <video
                ref={(el) => { videoRefs.current[video.id] = el; }}
                src={video.videoSrc}
                poster={video.thumbnail}
                loop
                playsInline
                className="w-full h-full object-cover"
                onPause={() => { if (playingId === video.id) setPlayingId(null); }}
              />

              {/* Play overlay */}
              {playingId !== video.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play size={20} className="text-primary ml-1" fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Admin controls */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditDetails(video); }}
                    className="p-1.5 bg-black/80 text-white rounded-full hover:bg-black"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }}
                    className="p-1.5 bg-red-600/90 text-white rounded-full hover:bg-red-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Title & client */}
            {(video.title || video.clientName) && (
              <div className="mt-2 px-1">
                {video.title && (
                  <p className="text-xs font-poppins font-medium text-foreground truncate">{video.title}</p>
                )}
                {video.clientName && (
                  <p className="text-[10px] font-poppins text-muted-foreground truncate">{video.clientName}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvitationsGallery;
