// Pexels API Service
const PEXELS_API_KEY = 'mLmLepwe813Hq6XaUbSP52rzAXKrnOWghYojNQz7oVuclLnznDewdL1P';
const PEXELS_API_BASE = 'https://api.pexels.com/v1';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
  prev_page?: string;
}

// Category-specific search queries for Golden Photography
export const categoryQueries: Record<string, string> = {
  'WEDDING': 'indian wedding rajasthani bride groom',
  'BIRTHDAY': 'birthday celebration party cake indian',
  'TRADITIONAL': 'rajasthani traditional culture festival jaipur',
  'EVENTS': 'indian event celebration function gathering',
  'MATERNITY': 'maternity pregnancy photoshoot beautiful',
  'INVITATIONS': 'wedding invitation card design indian',
  'REELS': 'indian dance celebration colorful video',
  'SELECTED': 'indian wedding photography beautiful',
};

export const fetchPexelsPhotos = async (
  category: string,
  page: number = 1,
  perPage: number = 15
): Promise<PexelsResponse> => {
  const query = categoryQueries[category] || categoryQueries['SELECTED'];

  const response = await fetch(
    `${PEXELS_API_BASE}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.statusText}`);
  }

  return response.json();
};

export interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number | null;
  height: number | null;
  fps: number;
  link: string;
}

export interface PexelsVideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: PexelsVideoFile[];
  video_pictures: PexelsVideoPicture[];
}

export interface PexelsVideosResponse {
  page: number;
  per_page: number;
  videos: PexelsVideo[];
  total_results: number;
  url: string;
  next_page?: string;
  prev_page?: string;
}

export const fetchPexelsVideos = async (
  category: string,
  page: number = 1,
  perPage: number = 5
): Promise<PexelsVideosResponse> => {
  const query = categoryQueries[category] || categoryQueries['SELECTED'];

  const response = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Pexels Videos API error: ${response.statusText}`);
  }

  return response.json();
};

export const fetchMixedMedia = async (
  category: string,
  page: number = 1,
  totalItems: number = 20
) => {
  const photoCount = Math.floor(totalItems * 0.8);
  const videoCount = Math.floor(totalItems * 0.2);

  const [photosData, videosData] = await Promise.all([
    fetchPexelsPhotos(category, page, photoCount),
    fetchPexelsVideos(category, page, videoCount),
  ]);

  const photos = photosData.photos.map((photo: PexelsPhoto) => ({
    ...transformPexelsToGalleryImage(photo),
    type: 'image' as const,
  }));

  const videos = videosData.videos.map((video: PexelsVideo) => ({
    type: 'video' as const,
    src: video.image,
    videoSrc: video.video_files.find(f => f.quality === 'hd')?.link || video.video_files[0].link,
    highResSrc: video.image,
    alt: `Video by ${video.user.name}`,
    photographer: video.user.name,
    client: 'Golden Photography',
    location: 'Beawar, Rajasthan',
    details: `Video by ${video.user.name}`,
    category: category,
    width: video.width,
    height: video.height,
  }));

  const mixed: any[] = [];
  let videoIndex = 0;

  photos.forEach((photo, idx) => {
    mixed.push(photo);
    if ((idx + 1) % 4 === 0 && videoIndex < videos.length) {
      mixed.push(videos[videoIndex]);
      videoIndex++;
    }
  });

  while (videoIndex < videos.length) {
    mixed.push(videos[videoIndex]);
    videoIndex++;
  }

  return {
    items: mixed,
    total_results: photosData.total_results + videosData.total_results,
  };
};

export const transformPexelsToGalleryImage = (photo: PexelsPhoto) => {
  return {
    src: photo.src.large,
    highResSrc: photo.src.large2x,
    alt: photo.alt || 'Golden Photography',
    photographer: photo.photographer,
    client: 'Golden Photography',
    location: 'Beawar, Rajasthan',
    details: `Photo by ${photo.photographer}`,
    category: 'GALLERY',
    width: photo.width,
    height: photo.height
  };
};
