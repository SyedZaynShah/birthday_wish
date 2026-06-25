export type LetterParagraph = {
  id: string;
  /** Edit letter text here — layout is driven by this file only */
  text: string;
  variant?: "salutation" | "body" | "signature";
};

export const letterMeta = {
  chapter: "Chapter 6",
  title: "A Letter Written Among The Stars ✨",
  subtitle: "Some things are easier to write than to say.",
};

export const letterParagraphs: LetterParagraph[] = [
  {
    id: "salutation",
    variant: "salutation",
    text: "My Dearest Humaima,\n\nHappy Birthday, my love. ❤️",
  },
  {
    id: "first-impression",
    variant: "body",
    text: "When you first texted me, I didn't have feelings for you, but the way you talked, your intelligence, and your kindness impressed me from the very beginning.",
  },
  {
    id: "falling-in-love",
    variant: "body",
    text: "As time passed, I fell in love with the person you are. I love your never-give-up attitude, your caring nature, and the way you always support me, understand me, and listen to me. No matter how many fights we have, you're always the one who puts your ego aside and tries to fix everything.",
  },
  {
    id: "possessive",
    variant: "body",
    text: "I even love your possessive side. The fact that you get annoyed when some random girl texts me, even when I don't reply, just shows how much you care. ❤️",
  },
  {
    id: "gratitude",
    variant: "body",
    text: "Thank you for being my biggest supporter, my peace, and my favorite person. May Allah bless you with endless happiness and success.\n\nHappy Birthday, my beautiful girl. 🤍🖤",
  },
  {
    id: "signature",
    variant: "signature",
    text: "Forever yours,\nZain ❤️",
  },
];

export const letterFinale = {
  birthdayLine: "Happy Birthday Humaima 🌙✨",
  closingLine: "You made my universe brighter.",
  heart: "❤️",
  transitionLine: "Some dreams are still waiting to be written...",
};
