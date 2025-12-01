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
