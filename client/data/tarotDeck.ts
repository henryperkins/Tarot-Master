// Complete 78-card Tarot Deck Data
// Based on Rider-Waite-Smith tradition

export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Arcana = "major" | "minor";

export interface TarotCard {
  id: string;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  number?: number;
  keywords: string[];
  upright: string;
  reversed: string;
  element?: string;
  astrology?: string;
}

// Major Arcana (22 cards)
export const majorArcana: TarotCard[] = [
  {
    id: "major-0",
    name: "The Fool",
    arcana: "major",
    number: 0,
    keywords: ["beginnings", "innocence", "spontaneity", "free spirit"],
    upright: "New beginnings, innocence, spontaneity, a free spirit. The Fool represents the start of a journey, unlimited potential, and taking a leap of faith into the unknown.",
    reversed: "Recklessness, risk-taking, naivety. When reversed, The Fool warns against being too impulsive or ignoring important risks.",
    element: "Air",
    astrology: "Uranus",
  },
  {
    id: "major-1",
    name: "The Magician",
    arcana: "major",
    number: 1,
    keywords: ["manifestation", "resourcefulness", "power", "inspired action"],
    upright: "Manifestation, resourcefulness, power, inspired action. The Magician channels the elements to create change and reminds you that you have all the tools you need.",
    reversed: "Manipulation, poor planning, untapped talents. Reversed suggests wasted potential or using skills for deception.",
    element: "Air",
    astrology: "Mercury",
  },
  {
    id: "major-2",
    name: "The High Priestess",
    arcana: "major",
    number: 2,
    keywords: ["intuition", "sacred knowledge", "divine feminine", "subconscious"],
    upright: "Intuition, sacred knowledge, the subconscious mind. She guards the veil between worlds and invites you to trust your inner wisdom.",
    reversed: "Secrets, disconnected from intuition, withdrawal. Reversed indicates ignoring your inner voice or hidden agendas.",
    element: "Water",
    astrology: "Moon",
  },
  {
    id: "major-3",
    name: "The Empress",
    arcana: "major",
    number: 3,
    keywords: ["femininity", "beauty", "nature", "abundance"],
    upright: "Femininity, beauty, nature, nurturing, abundance. The Empress represents fertility, creative expression, and connection to the natural world.",
    reversed: "Creative block, dependence on others. Reversed suggests neglecting self-care or smothering behavior.",
    element: "Earth",
    astrology: "Venus",
  },
  {
    id: "major-4",
    name: "The Emperor",
    arcana: "major",
    number: 4,
    keywords: ["authority", "structure", "control", "fatherhood"],
    upright: "Authority, establishment, structure, a father figure. The Emperor represents order, stability, and taking control of your domain.",
    reversed: "Tyranny, rigidity, coldness. Reversed warns of excessive control or abuse of power.",
    element: "Fire",
    astrology: "Aries",
  },
  {
    id: "major-5",
    name: "The Hierophant",
    arcana: "major",
    number: 5,
    keywords: ["tradition", "conformity", "morality", "ethics"],
    upright: "Spiritual wisdom, religious beliefs, conformity, tradition. The Hierophant represents established institutions and conventional approaches.",
    reversed: "Personal beliefs, freedom, challenging the status quo. Reversed encourages finding your own spiritual path.",
    element: "Earth",
    astrology: "Taurus",
  },
  {
    id: "major-6",
    name: "The Lovers",
    arcana: "major",
    number: 6,
    keywords: ["love", "harmony", "relationships", "values alignment"],
    upright: "Love, harmony, relationships, values alignment, choices. The Lovers represent union, attraction, and important decisions about partnerships.",
    reversed: "Self-love, disharmony, imbalance. Reversed indicates relationship conflicts or fear of commitment.",
    element: "Air",
    astrology: "Gemini",
  },
  {
    id: "major-7",
    name: "The Chariot",
    arcana: "major",
    number: 7,
    keywords: ["control", "willpower", "success", "determination"],
    upright: "Control, willpower, success, action, determination. The Chariot represents victory through focus and harnessing opposing forces.",
    reversed: "Self-discipline lacking, opposition, no direction. Reversed warns of scattered energy or loss of control.",
    element: "Water",
    astrology: "Cancer",
  },
  {
    id: "major-8",
    name: "Strength",
    arcana: "major",
    number: 8,
    keywords: ["courage", "patience", "control", "compassion"],
    upright: "Strength, courage, patience, influence, compassion. This card represents inner strength and the power of gentle persistence over brute force.",
    reversed: "Inner strength lacking, self-doubt, raw emotion. Reversed suggests struggling with confidence or losing composure.",
    element: "Fire",
    astrology: "Leo",
  },
  {
    id: "major-9",
    name: "The Hermit",
    arcana: "major",
    number: 9,
    keywords: ["soul-searching", "introspection", "inner guidance", "solitude"],
    upright: "Soul-searching, introspection, being alone, inner guidance. The Hermit illuminates the path of self-discovery and wisdom gained through solitude.",
    reversed: "Isolation, loneliness, withdrawal. Reversed warns of excessive isolation or refusing to seek help.",
    element: "Earth",
    astrology: "Virgo",
  },
  {
    id: "major-10",
    name: "Wheel of Fortune",
    arcana: "major",
    number: 10,
    keywords: ["good luck", "karma", "life cycles", "destiny"],
    upright: "Good luck, karma, life cycles, destiny, turning point. The Wheel reminds us that change is constant and fortune is always turning.",
    reversed: "Bad luck, resistance to change, breaking cycles. Reversed suggests fighting against inevitable change.",
    element: "Fire",
    astrology: "Jupiter",
  },
  {
    id: "major-11",
    name: "Justice",
    arcana: "major",
    number: 11,
    keywords: ["fairness", "truth", "law", "cause and effect"],
    upright: "Justice, fairness, truth, cause and effect, law. Justice represents karmic balance, legal matters, and taking responsibility.",
    reversed: "Unfairness, dishonesty, unaccountability. Reversed warns of injustice or avoiding consequences.",
    element: "Air",
    astrology: "Libra",
  },
  {
    id: "major-12",
    name: "The Hanged Man",
    arcana: "major",
    number: 12,
    keywords: ["pause", "surrender", "letting go", "new perspective"],
    upright: "Pause, surrender, letting go, new perspectives. The Hanged Man represents voluntary sacrifice and seeing things from a different angle.",
    reversed: "Delays, resistance, stalling. Reversed suggests being stuck or refusing to see another viewpoint.",
    element: "Water",
    astrology: "Neptune",
  },
  {
    id: "major-13",
    name: "Death",
    arcana: "major",
    number: 13,
    keywords: ["endings", "change", "transformation", "transition"],
    upright: "Endings, change, transformation, transition. Death represents profound transformation—the end of one chapter and the beginning of another.",
    reversed: "Resistance to change, personal transformation. Reversed indicates fear of letting go or prolonging the inevitable.",
    element: "Water",
    astrology: "Scorpio",
  },
  {
    id: "major-14",
    name: "Temperance",
    arcana: "major",
    number: 14,
    keywords: ["balance", "moderation", "patience", "purpose"],
    upright: "Balance, moderation, patience, purpose. Temperance represents the art of blending opposites and finding middle ground.",
    reversed: "Imbalance, excess, self-healing. Reversed suggests overindulgence or lack of long-term vision.",
    element: "Fire",
    astrology: "Sagittarius",
  },
  {
    id: "major-15",
    name: "The Devil",
    arcana: "major",
    number: 15,
    keywords: ["shadow self", "attachment", "addiction", "restriction"],
    upright: "Shadow self, attachment, addiction, restriction, sexuality. The Devil represents bondage to material desires and unhealthy patterns.",
    reversed: "Releasing limiting beliefs, exploring dark thoughts. Reversed suggests breaking free from chains or confronting shadow.",
    element: "Earth",
    astrology: "Capricorn",
  },
  {
    id: "major-16",
    name: "The Tower",
    arcana: "major",
    number: 16,
    keywords: ["sudden change", "upheaval", "chaos", "revelation"],
    upright: "Sudden change, upheaval, chaos, revelation, awakening. The Tower represents necessary destruction that clears the way for rebuilding.",
    reversed: "Personal transformation, fear of change. Reversed may indicate avoiding disaster or internal upheaval.",
    element: "Fire",
    astrology: "Mars",
  },
  {
    id: "major-17",
    name: "The Star",
    arcana: "major",
    number: 17,
    keywords: ["hope", "faith", "purpose", "renewal"],
    upright: "Hope, faith, purpose, renewal, spirituality. The Star represents inspiration, serenity, and healing after difficult times.",
    reversed: "Lack of faith, despair, self-trust. Reversed suggests lost hope or disconnection from purpose.",
    element: "Air",
    astrology: "Aquarius",
  },
  {
    id: "major-18",
    name: "The Moon",
    arcana: "major",
    number: 18,
    keywords: ["illusion", "fear", "anxiety", "subconscious"],
    upright: "Illusion, fear, anxiety, subconscious, intuition. The Moon illuminates hidden truths and the realm of dreams and shadow.",
    reversed: "Release of fear, repressed emotions. Reversed suggests clarity emerging from confusion.",
    element: "Water",
    astrology: "Pisces",
  },
  {
    id: "major-19",
    name: "The Sun",
    arcana: "major",
    number: 19,
    keywords: ["positivity", "fun", "warmth", "success"],
    upright: "Positivity, fun, warmth, success, vitality. The Sun represents joy, confidence, and the radiant energy of achievement.",
    reversed: "Inner child, feeling down, overly optimistic. Reversed suggests temporary sadness or unrealistic expectations.",
    element: "Fire",
    astrology: "Sun",
  },
  {
    id: "major-20",
    name: "Judgement",
    arcana: "major",
    number: 20,
    keywords: ["judgement", "rebirth", "inner calling", "absolution"],
    upright: "Judgement, rebirth, inner calling, absolution. Judgement represents awakening to higher purpose and making important life decisions.",
    reversed: "Self-doubt, inner critic. Reversed warns of harsh self-judgment or ignoring your calling.",
    element: "Fire",
    astrology: "Pluto",
  },
  {
    id: "major-21",
    name: "The World",
    arcana: "major",
    number: 21,
    keywords: ["completion", "integration", "accomplishment", "travel"],
    upright: "Completion, integration, accomplishment, travel. The World represents the successful conclusion of a major life cycle.",
    reversed: "Seeking personal closure, shortcuts. Reversed suggests unfinished business or incomplete cycles.",
    element: "Earth",
    astrology: "Saturn",
  },
];

// Minor Arcana helper function
const createMinorCard = (
  suit: Suit,
  number: number,
  name: string,
  keywords: string[],
  upright: string,
  reversed: string
): TarotCard => ({
  id: `${suit}-${number}`,
  name,
  arcana: "minor",
  suit,
  number,
  keywords,
  upright,
  reversed,
  element: suit === "wands" ? "Fire" : suit === "cups" ? "Water" : suit === "swords" ? "Air" : "Earth",
});

// Wands (Fire) - Action, creativity, energy
export const wands: TarotCard[] = [
  createMinorCard("wands", 1, "Ace of Wands", ["inspiration", "new opportunities", "growth"], "A spark of inspiration and new creative energy enters your life. This is a time of potential and excitement.", "Delays in new projects, lack of direction, or creative blocks. Energy may be scattered."),
  createMinorCard("wands", 2, "Two of Wands", ["future planning", "progress", "decisions"], "Planning for the future with confidence. You hold the world in your hands and must choose your path.", "Fear of the unknown, lack of planning, or staying in your comfort zone."),
  createMinorCard("wands", 3, "Three of Wands", ["expansion", "foresight", "overseas"], "Your plans are taking shape. Look to the horizon—expansion and progress are coming.", "Delays, obstacles in your path, or frustration with slow progress."),
  createMinorCard("wands", 4, "Four of Wands", ["celebration", "harmony", "homecoming"], "A time of celebration and harmony. Enjoy the fruits of your labor with loved ones.", "Personal celebration needed, or tension in home or community."),
  createMinorCard("wands", 5, "Five of Wands", ["conflict", "competition", "tension"], "Healthy competition or conflict of ideas. Multiple perspectives clash but can lead to growth.", "Avoiding conflict, inner turmoil, or the end of competition."),
  createMinorCard("wands", 6, "Six of Wands", ["success", "public recognition", "victory"], "Victory and public recognition for your efforts. Your hard work is being acknowledged.", "Private achievement, fall from grace, or delayed recognition."),
  createMinorCard("wands", 7, "Seven of Wands", ["challenge", "competition", "perseverance"], "Standing your ground against challenges. Defend your position with courage.", "Giving up, being overwhelmed, or avoiding confrontation."),
  createMinorCard("wands", 8, "Eight of Wands", ["speed", "action", "movement"], "Rapid movement and swift action. Things are accelerating quickly.", "Delays, frustration, or waiting for results that seem slow in coming."),
  createMinorCard("wands", 9, "Nine of Wands", ["resilience", "persistence", "boundaries"], "You've been through challenges but remain standing. Stay vigilant and protect what you've built.", "Exhaustion, giving up, or paranoia about threats that may not exist."),
  createMinorCard("wands", 10, "Ten of Wands", ["burden", "responsibility", "hard work"], "Carrying heavy burdens and responsibilities. You may be taking on too much.", "Unable to delegate, breakdown, or learning to release burdens."),
  createMinorCard("wands", 11, "Page of Wands", ["inspiration", "discovery", "free spirit"], "A young spirit full of enthusiasm and new ideas. Be open to inspiration and adventure.", "Newly found passion, redirect energy, or lack of direction."),
  createMinorCard("wands", 12, "Knight of Wands", ["energy", "passion", "action"], "Passionate pursuit of goals with fiery energy. Act on your impulses but watch for recklessness.", "Passion without direction, haste, or scattered energy."),
  createMinorCard("wands", 13, "Queen of Wands", ["courage", "confidence", "independence"], "Confident, warm, and determined. Lead with passion and inspire others through your example.", "Self-respect returning, introverted, or reclaiming personal power."),
  createMinorCard("wands", 14, "King of Wands", ["leadership", "vision", "entrepreneur"], "Natural leader with vision and charisma. Take bold action and inspire others.", "Impulsive, overbearing, or high expectations that overwhelm."),
];

// Cups (Water) - Emotions, relationships, creativity
export const cups: TarotCard[] = [
  createMinorCard("cups", 1, "Ace of Cups", ["new love", "compassion", "creativity"], "Emotional new beginnings. Open your heart to love, creativity, and deep feelings.", "Self-love needed, blocked emotions, or emotional loss."),
  createMinorCard("cups", 2, "Two of Cups", ["unified love", "partnership", "connection"], "Deep connection and partnership. Two hearts coming together in harmony.", "Imbalance in relationship, broken communication, or separation."),
  createMinorCard("cups", 3, "Three of Cups", ["celebration", "friendship", "community"], "Celebration with friends and community. Joy shared is joy multiplied.", "Independence needed, gossip, or overindulgence."),
  createMinorCard("cups", 4, "Four of Cups", ["meditation", "contemplation", "apathy"], "Turning inward, perhaps missing opportunities due to preoccupation.", "Awareness returning, acceptance, or moving forward."),
  createMinorCard("cups", 5, "Five of Cups", ["regret", "failure", "disappointment"], "Grief and regret over loss. But notice what remains—not all is lost.", "Acceptance, moving on, or finding silver linings."),
  createMinorCard("cups", 6, "Six of Cups", ["nostalgia", "childhood", "innocence"], "Sweet memories and nostalgia. Reconnecting with your inner child or past.", "Stuck in the past, moving forward, or unrealistic nostalgia."),
  createMinorCard("cups", 7, "Seven of Cups", ["opportunities", "choices", "wishful thinking"], "Many possibilities before you, but beware of illusions. Choose wisely.", "Alignment, personal values, or overwhelmed by choices."),
  createMinorCard("cups", 8, "Eight of Cups", ["disappointment", "abandonment", "withdrawal"], "Walking away from what no longer serves you. Seeking deeper meaning.", "Avoidance, fear of change, or trying one more time."),
  createMinorCard("cups", 9, "Nine of Cups", ["contentment", "satisfaction", "gratitude"], "The wish card—emotional fulfillment and satisfaction. Enjoy this moment.", "Inner happiness seeking, materialism, or dissatisfaction."),
  createMinorCard("cups", 10, "Ten of Cups", ["divine love", "blissful relationships", "harmony"], "Emotional fulfillment and happy family life. The rainbow after the storm.", "Disconnection, misaligned values, or broken family dynamics."),
  createMinorCard("cups", 11, "Page of Cups", ["creative opportunities", "intuition", "curiosity"], "A dreamer with creative potential. Listen to your intuition and stay curious.", "Emotional immaturity, creative blocks, or moody behavior."),
  createMinorCard("cups", 12, "Knight of Cups", ["romance", "charm", "imagination"], "The romantic knight brings proposals and invitations. Follow your heart.", "Unrealistic expectations, moodiness, or jealousy."),
  createMinorCard("cups", 13, "Queen of Cups", ["compassion", "nurturing", "intuition"], "Deeply intuitive and emotionally nurturing. Trust your feelings and care for others.", "Inner feelings, self-care needed, or emotional boundaries."),
  createMinorCard("cups", 14, "King of Cups", ["emotional balance", "control", "generosity"], "Mastery over emotions. Wise counsel and emotional stability for all.", "Emotional manipulation, moodiness, or volatility."),
];

// Swords (Air) - Intellect, conflict, truth
export const swords: TarotCard[] = [
  createMinorCard("swords", 1, "Ace of Swords", ["breakthrough", "clarity", "truth"], "Mental clarity and breakthrough. The sword cuts through confusion to reveal truth.", "Confusion, chaos, or lack of clarity. Misuse of intellect."),
  createMinorCard("swords", 2, "Two of Swords", ["difficult decisions", "denial", "stalemate"], "At a crossroads, perhaps avoiding a difficult choice. Remove the blindfold.", "Indecision, confusion, or information overload."),
  createMinorCard("swords", 3, "Three of Swords", ["heartbreak", "suffering", "grief"], "Painful heartbreak and emotional pain. Allow yourself to grieve.", "Recovery, forgiveness, or moving on from pain."),
  createMinorCard("swords", 4, "Four of Swords", ["rest", "recovery", "contemplation"], "A time for rest and recovery. Step back and recharge before continuing.", "Restlessness, burnout, or awakening from rest."),
  createMinorCard("swords", 5, "Five of Swords", ["conflict", "defeat", "win at all costs"], "Hollow victory or defeat. Consider whether winning is worth the cost.", "Reconciliation, making amends, or past resentment."),
  createMinorCard("swords", 6, "Six of Swords", ["transition", "change", "rite of passage"], "Moving away from difficulty toward calmer waters. A necessary transition.", "Resistance to change, unfinished business, or unable to move on."),
  createMinorCard("swords", 7, "Seven of Swords", ["deception", "strategy", "resourcefulness"], "Strategy or deception. Are you being clever or underhanded?", "Coming clean, conscience, or getting caught."),
  createMinorCard("swords", 8, "Eight of Swords", ["restriction", "imprisonment", "self-victimization"], "Feeling trapped, but the bindings are often self-imposed. You can free yourself.", "Self-acceptance, new perspective, or freedom."),
  createMinorCard("swords", 9, "Nine of Swords", ["anxiety", "worry", "fear"], "Nightmares and anxiety. Your fears may be worse than reality.", "Hope, reaching out, or worst is over."),
  createMinorCard("swords", 10, "Ten of Swords", ["painful endings", "betrayal", "rock bottom"], "The darkest hour before dawn. A painful ending, but also a fresh start.", "Recovery, regeneration, or lessons learned."),
  createMinorCard("swords", 11, "Page of Swords", ["curiosity", "restlessness", "mental energy"], "Sharp mind eager for knowledge. Stay curious but think before speaking.", "Hasty decisions, scattered thoughts, or all talk no action."),
  createMinorCard("swords", 12, "Knight of Swords", ["ambitious", "action-oriented", "driven"], "Charging forward with determination. Act quickly but don't be reckless.", "Restlessness, burnout, or aggression without direction."),
  createMinorCard("swords", 13, "Queen of Swords", ["clear thinking", "independence", "direct communication"], "Sharp intellect and clear boundaries. Speak truth with compassion.", "Coldness, cruelty, or using words as weapons."),
  createMinorCard("swords", 14, "King of Swords", ["intellectual power", "authority", "truth"], "Mastery of intellect and clear judgment. Make decisions with wisdom.", "Tyranny, manipulation, or misuse of power."),
];

// Pentacles (Earth) - Material, work, body
export const pentacles: TarotCard[] = [
  createMinorCard("pentacles", 1, "Ace of Pentacles", ["new opportunity", "prosperity", "manifestation"], "A new opportunity for material abundance. Plant seeds for future prosperity.", "Lost opportunity, lack of planning, or scarcity mindset."),
  createMinorCard("pentacles", 2, "Two of Pentacles", ["balance", "adaptability", "time management"], "Juggling priorities and maintaining balance. Stay flexible.", "Overcommitted, imbalance, or difficulty prioritizing."),
  createMinorCard("pentacles", 3, "Three of Pentacles", ["teamwork", "collaboration", "learning"], "Collaboration and skilled work. Your talents are being recognized.", "Lack of teamwork, disregard for skills, or poor quality."),
  createMinorCard("pentacles", 4, "Four of Pentacles", ["saving", "security", "conservatism"], "Holding tight to resources. Security is good, but don't let it become greed.", "Generosity, spending, or letting go of control."),
  createMinorCard("pentacles", 5, "Five of Pentacles", ["financial loss", "poverty", "isolation"], "Difficult times and feeling left out in the cold. Help may be closer than you think.", "Recovery, spiritual poverty improving, or finding support."),
  createMinorCard("pentacles", 6, "Six of Pentacles", ["generosity", "charity", "sharing"], "Giving and receiving in balance. Generosity flows in both directions.", "Self-care, one-sided generosity, or debt."),
  createMinorCard("pentacles", 7, "Seven of Pentacles", ["patience", "investment", "long-term view"], "Evaluating progress and waiting for harvest. Patience will pay off.", "Impatience, poor results, or lack of reward."),
  createMinorCard("pentacles", 8, "Eight of Pentacles", ["apprenticeship", "skill development", "diligence"], "Dedication to craft and continuous improvement. Master your skills.", "Perfectionism, lack of motivation, or misdirected efforts."),
  createMinorCard("pentacles", 9, "Nine of Pentacles", ["abundance", "luxury", "self-sufficiency"], "Enjoying the fruits of your labor. Independence and material comfort.", "Self-worth issues, overinvestment in work, or hustling."),
  createMinorCard("pentacles", 10, "Ten of Pentacles", ["wealth", "family", "legacy"], "Generational wealth and family security. Building lasting legacy.", "Family financial troubles, loss, or short-term focus."),
  createMinorCard("pentacles", 11, "Page of Pentacles", ["manifestation", "financial opportunity", "study"], "Eager student ready to learn practical skills. New opportunities for growth.", "Lack of focus, procrastination, or unrealistic goals."),
  createMinorCard("pentacles", 12, "Knight of Pentacles", ["efficiency", "routine", "conservatism"], "Steady, reliable progress. Stay the course with patience.", "Boredom, stagnation, or stubbornness."),
  createMinorCard("pentacles", 13, "Queen of Pentacles", ["nurturing", "practical", "providing"], "Practical wisdom and nurturing abundance. Create a comfortable home.", "Work-life imbalance, smothering, or financial independence needed."),
  createMinorCard("pentacles", 14, "King of Pentacles", ["wealth", "business", "leadership"], "Material success and business acumen. Build lasting prosperity.", "Greed, materialism, or corruption."),
];

// Complete deck
export const fullDeck: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles,
];

// Helper functions
export const getCardById = (id: string): TarotCard | undefined =>
  fullDeck.find((card) => card.id === id);

export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getMajorArcana = (): TarotCard[] => majorArcana;
export const getMinorArcana = (): TarotCard[] => [...wands, ...cups, ...swords, ...pentacles];
export const getSuit = (suit: Suit): TarotCard[] =>
  suit === "wands" ? wands : suit === "cups" ? cups : suit === "swords" ? swords : pentacles;
