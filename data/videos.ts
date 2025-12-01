export interface Video {
  id: string;
  title: string;
  category: 'Goggins' | 'Jocko' | 'Running' | 'War Mode';
  thumbnail?: string; // Optional, can be auto-generated from YouTube ID
}

export const videos: Video[] = [
  {
    id: 'ShortsID1', // User to replace with real ID
    title: "Stay Hard - David Goggins",
    category: 'Goggins'
  },
  {
    id: 'ShortsID2',
    title: "Discipline Equals Freedom",
    category: 'Jocko'
  },
  {
    id: 'ShortsID3',
    title: "The Only Easy Day Was Yesterday",
    category: 'War Mode'
  },
  // Add more videos here
  // To get ID: https://www.youtube.com/shorts/THIS_PART_IS_THE_ID
];

export const getVideosByCategory = (category: string): Video[] => {
  if (category === 'All') return videos;
  return videos.filter(v => v.category === category);
};
