export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: 'Stoicism' | 'War' | 'Discipline' | 'Mindset' | 'Fitness' | 'Masculinity';
  tags: string[];
}

export const quotes: Quote[] = [
  {
    id: '1',
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "Stoicism",
    tags: ["control", "mind", "strength"]
  },
  {
    id: '2',
    text: "The only easy day was yesterday.",
    author: "US Navy SEALs",
    category: "Discipline",
    tags: ["resilience", "hard work"]
  },
  {
    id: '3',
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    category: "Mindset",
    tags: ["purpose", "suffering"]
  },
  {
    id: '4',
    text: "It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable.",
    author: "Socrates",
    category: "Fitness",
    tags: ["body", "potential"]
  },
  {
    id: '5',
    text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
    author: "Sun Tzu",
    source: "The Art of War",
    category: "War",
    tags: ["strategy", "preparation"]
  },
  {
    id: '6',
    text: "I don't stop when I'm tired. I stop when I'm done.",
    author: "David Goggins",
    category: "Discipline",
    tags: ["relentless", "endurance"]
  },
  {
    id: '7',
    text: "Waste no more time arguing what a good man should be. Be one.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "Stoicism",
    tags: ["action", "virtue"]
  },
  {
    id: '8',
    text: "Civilize the mind, but make savage the body.",
    author: "Mao Zedong",
    category: "Masculinity",
    tags: ["balance", "strength"]
  },
  {
    id: '9',
    text: "Discipline is doing what you hate to do, but doing it like you love it.",
    author: "Mike Tyson",
    category: "Discipline",
    tags: ["mental toughness"]
  },
  {
    id: '10',
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    category: "Stoicism",
    tags: ["anxiety", "perception"]
  },
  {
    id: '11',
    text: "If you want to be a lion, you must train with lions.",
    author: "Carlson Gracie",
    category: "Masculinity",
    tags: ["environment", "growth"]
  },
  {
    id: '12',
    text: "Pain is weakness leaving the body.",
    author: "Unknown",
    category: "Fitness",
    tags: ["pain", "growth"]
  },
  {
    id: '13',
    text: "Appear weak when you are strong, and strong when you are weak.",
    author: "Sun Tzu",
    source: "The Art of War",
    category: "War",
    tags: ["deception", "strategy"]
  },
  {
    id: '14',
    text: "Stay hard.",
    author: "David Goggins",
    category: "Mindset",
    tags: ["toughness"]
  },
  {
    id: '15',
    text: "A man who is a master of patience is master of everything else.",
    author: "George Savile",
    category: "Masculinity",
    tags: ["patience", "control"]
  },
  {
    id: '16',
    text: "Discipline equals freedom.",
    author: "Jocko Willink",
    category: "Discipline",
    tags: ["freedom", "leadership"]
  },
  {
    id: '17',
    text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.",
    author: "Miyamoto Musashi",
    source: "The Book of Five Rings",
    category: "War",
    tags: ["self-reliance", "mastery"]
  },
  {
    id: '18',
    text: "Compare yourself to who you were yesterday, not to who someone else is today.",
    author: "Jordan Peterson",
    category: "Mindset",
    tags: ["growth", "comparison"]
  },
  {
    id: '19',
    text: "No man has the right to be an amateur in the matter of physical training.",
    author: "Socrates",
    category: "Fitness",
    tags: ["duty", "strength"]
  },
  {
    id: '20',
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "Stoicism",
    tags: ["mindset", "happiness"]
  },
  {
    id: '21',
    text: "If you're going through hell, keep going.",
    author: "Winston Churchill",
    category: "War",
    tags: ["perseverance", "resilience"]
  },
  {
    id: '22',
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    category: "Discipline",
    tags: ["action", "greatness"]
  },
  {
    id: '23',
    text: "A man who wants to lead the orchestra must turn his back on the crowd.",
    author: "Max Lucado",
    category: "Masculinity",
    tags: ["leadership", "focus"]
  },
  {
    id: '24',
    text: "He who conquers himself is the mightiest warrior.",
    author: "Confucius",
    category: "War",
    tags: ["self-control", "victory"]
  },
  {
    id: '25',
    text: "Obsession is the only thing that matters.",
    author: "David Goggins",
    category: "Mindset",
    tags: ["obsession", "drive"]
  },
  {
    id: '26',
    text: "The body should be treated rigorously, that it may not be disobedient to the mind.",
    author: "Seneca",
    category: "Fitness",
    tags: ["discipline", "body-mind"]
  },
  {
    id: '27',
    text: "It's not the load that breaks you down, it's the way you carry it.",
    author: "Lou Holtz",
    category: "Mindset",
    tags: ["attitude", "strength"]
  },
  {
    id: '28',
    text: "Do not pray for an easy life, pray for the strength to endure a difficult one.",
    author: "Bruce Lee",
    category: "Stoicism",
    tags: ["strength", "endurance"]
  },
  {
    id: '29',
    text: "A smooth sea never made a skilled sailor.",
    author: "Franklin D. Roosevelt",
    category: "Masculinity",
    tags: ["adversity", "growth"]
  },
  {
    id: '30',
    text: "Your potential is one thing. What you do with it is another.",
    author: "Unknown",
    category: "Discipline",
    tags: ["potential", "action"]
  },
  {
    id: '31',
    text: "Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.",
    author: "Sun Tzu",
    source: "The Art of War",
    category: "War",
    tags: ["strategy", "planning"]
  },
  {
    id: '32',
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "Stoicism",
    tags: ["obstacles", "perspective"]
  },
  {
    id: '33',
    text: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.",
    author: "Ronnie Coleman",
    category: "Fitness",
    tags: ["hard work", "reality"]
  },
  {
    id: '34',
    text: "A man should be upright, not be kept upright.",
    author: "Marcus Aurelius",
    category: "Masculinity",
    tags: ["integrity", "independence"]
  },
  {
    id: '35',
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Mindset",
    tags: ["courage", "persistence"]
  }
];

export const getDailyQuote = (): Quote => {
  // Use the date string to deterministically pick a quote
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % quotes.length;
  return quotes[index];
};

export const getQuotesByCategory = (category: string): Quote[] => {
  if (category === 'All') return quotes;
  return quotes.filter(q => q.category === category);
};
