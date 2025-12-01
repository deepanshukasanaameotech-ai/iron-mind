export interface Video {
  id: string;
  title: string;
  category: 'Goggins' | 'Jocko' | 'Running' | 'War Mode';
  thumbnail?: string; // Optional, can be auto-generated from YouTube ID
}

export const videos: Video[] = [
  {
    id: 'H5XpcvfCP9g', // User to replace with real ID
    title: "Stay Hard - David Goggins",
    category: 'Goggins'
  },
  {
    id: 'S30tE6EPWa5Q',
    title: "Discipline Equals Freedom",
    category: 'Jocko'
  },
  {
    id: '7nOCjzYtzwY',
    title: "The Only Easy Day Was Yesterday",
    category: 'War Mode'
  },

  { id: "oKEqarvUAvw", title: "BECAUSE YOU'RE NOT | David Goggins Motivation", category: "Goggins" },  // :contentReference[oaicite:0]{index=0}
  { id: "_9rC0UuEjwM", title: "If You're Struggling With Motivation, Watch This ⚡️", category: "Goggins" },  // :contentReference[oaicite:1]{index=1}
  { id: "bxXFYPrB64w", title: "How To Master Your Mind – David Goggins #shorts", category: "Goggins" },  
  { id: "xPmPxxhv9hA", title: "David Goggins Wants You To Know This... #shorts", category: "Goggins" },  // :contentReference[oaicite:2]{index=2}
  { id: "hDJU6LUQjGY", title: "3 Minutes That Will Change Your Mindset – David Goggins #shorts", category: "Goggins" },  // :contentReference[oaicite:3]{index=3}
  { id: "r1qQmanwMiI", title: "Set Goals You CAN'T Achieve – David Goggins #shorts", category: "Goggins" },  // :contentReference[oaicite:4]{index=4}
  { id: "IicbiwTAslE", title: "YOU'RE SCARED OF THE EFFORT! – David Goggins #shorts", category: "Goggins" },  // :contentReference[oaicite:5]{index=5}

  { id: "55Rw6NkGaf0", title: "No Shortcuts to Greatness! – Jocko Willink #shorts", category: "Jocko" },  // :contentReference[oaicite:6]{index=6}
  { id: "h0NJPWb2j4w", title: "How To OVERCOME Any Bad Situation – Jocko Willink #shorts", category: "Jocko" },  // :contentReference[oaicite:7]{index=7}
  { id: "bwZ2wvhFJbY", title: "Comfort Is the Enemy. Be Relentless – Jocko Willink Mindset #shorts", category: "Jocko" },  // :contentReference[oaicite:8]{index=8}
  { id: "o63FRwkWUxg", title: "2 Minutes That Will Change Your Life – Discipline (Jocko) #shorts", category: "Jocko" },  // :contentReference[oaicite:9]{index=9}
  { id: "7JPrOUsGVeY", title: "Later Is the Killer of Dreams – Jocko Willink #shorts", category: "Jocko" },  // :contentReference[oaicite:10]{index=10}
  { id: "P7D5FmHtQrs", title: "You Have To Keep Moving Forward – Jocko Willink #shorts", category: "Jocko" },  // :contentReference[oaicite:11]{index=11}
  { id: "fAnaTtoYDXs", title: "GOOD. – Jocko Willink Motivation #shorts", category: "Jocko" },  // :contentReference[oaicite:12]{index=12}

  { id: "Xo66_9OvC3w", title: "The Peaceful Life After the Climb – David Goggins Motivation #shorts", category: "Goggins" },  // :contentReference[oaicite:13]{index=13}
  { id: "7NWEhYjAdgQ", title: "David Goggins 40% Rule – Motivation #shorts", category: "Goggins" },  // :contentReference[oaicite:14]{index=14}
  { id: "UZKSiIbCsWM", title: "How to Achieve Your Goals (With Jocko Willink) #shorts", category: "Jocko" },  // :contentReference[oaicite:15]{index=15}
  { id: "PXlAeZ6TUZM", title: "How Bad Do You Want It? – Jocko Willink & David Goggins #shorts", category: "War Mode" },  // :contentReference[oaicite:16]{index=16}
  { id: "ZWAxuafihSk", title: "NO EXCUSES — Get It Done – Motivation #shorts", category: "Jocko" }  // :contentReference[oaicite:17]{index=17}
  // Add more videos here
  // To get ID: https://www.youtube.com/shorts/THIS_PART_IS_THE_ID
];

export const getVideosByCategory = (category: string): Video[] => {
  if (category === 'All') return videos;
  return videos.filter(v => v.category === category);
};
