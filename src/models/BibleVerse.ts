type Verse = {
    book_id: number;
    book_name: string;
    chapter: number;
    text: string;
}

export type BibleVerse = {
    reference: string;
    verses: Verse[];
    text: string;
}