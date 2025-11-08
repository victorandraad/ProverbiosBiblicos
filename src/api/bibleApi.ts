import axios from "axios"
import { BibleVerse } from "../models/BibleVerse"

function startsWithLowerCase(text: string): boolean {
    if (!text || text.length === 0) return false;
    const trimmed = text.trim();
    if (trimmed.length === 0) return false;
    const firstChar = trimmed[0];
    // Verifica se é uma letra e se é minúscula
    return /[a-záàâãéêíóôõúç]/.test(firstChar);
}

function startsWithUpperCase(text: string): boolean {
    if (!text || text.length === 0) return false;
    const trimmed = text.trim();
    if (trimmed.length === 0) return false;
    const firstChar = trimmed[0];
    // Verifica se é uma letra e se é maiúscula
    return /[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(firstChar);
}

async function fetchVerse(chapter: number, verse: number, retries: number = 3): Promise<BibleVerse> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const reference = `Proverbios ${chapter}:${verse}`;
            const response = await axios.get(`https://bible-api.com/${reference}?translation=almeida`);
            return response.data as BibleVerse;
        } catch (error) {
            // Se não for o último attempt, tenta novamente com novos valores aleatórios
            if (attempt < retries - 1) {
                chapter = Math.floor(Math.random() * 31) + 1;
                verse = Math.floor(Math.random() * 25) + 1;
                continue;
            }
            // Se esgotou as tentativas, lança o erro
            throw error;
        }
    }
    throw new Error('Não foi possível buscar versículo após várias tentativas');
}

async function getCompleteVerse(chapter: number, verse: number): Promise<BibleVerse> {
    // Busca o versículo inicial
    let currentVerse = await fetchVerse(chapter, verse);
    
    // Se o primeiro versículo começa com minúscula, busca versículos anteriores
    if (currentVerse.verses.length > 0 && startsWithLowerCase(currentVerse.verses[0].text)) {
        const allVerses = [...currentVerse.verses];
        const originalVerse = verse; // Mantém o versículo original final
        let startVerse = verse;
        let searchVerse = verse;
        
        // Busca versículos anteriores até encontrar um que comece com maiúscula
        while (searchVerse > 1) {
            searchVerse--;
            try {
                const previousVerse = await fetchVerse(chapter, searchVerse);
                
                if (previousVerse.verses.length > 0) {
                    const firstText = previousVerse.verses[0].text;
                    
                    // Se começa com maiúscula, encontramos o início
                    if (startsWithUpperCase(firstText)) {
                        // Adiciona os versículos anteriores no início
                        allVerses.unshift(...previousVerse.verses);
                        startVerse = searchVerse;
                        break;
                    } else {
                        // Continua buscando para trás
                        allVerses.unshift(...previousVerse.verses);
                        startVerse = searchVerse;
                    }
                }
            } catch (error) {
                // Se não conseguir buscar mais versículos, para
                console.warn(`Não foi possível buscar versículo ${chapter}:${searchVerse}`);
                break;
            }
        }
        
        // Cria a referência com o range de versículos
        const reference = startVerse === originalVerse
            ? `Provérbios ${chapter}:${startVerse}` 
            : `Provérbios ${chapter}:${startVerse}-${originalVerse}`;
        
        return {
            reference,
            verses: allVerses,
            text: allVerses.map(v => v.text).join(' ')
        };
    }
    
    return currentVerse;
}

export async function getRandomBibleVerseFromApi(): Promise<BibleVerse> {
    const chapter = Math.floor(Math.random() * 31) + 1;
    const verse = Math.floor(Math.random() * 25) + 1;
    return getCompleteVerse(chapter, verse);
}

async function getCompleteVerseWithRetry(chapter: number, verse: number, retries: number = 3): Promise<BibleVerse> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await getCompleteVerse(chapter, verse);
        } catch (error) {
            // Se não for o último attempt, tenta novamente com novos valores aleatórios
            if (attempt < retries - 1) {
                chapter = Math.floor(Math.random() * 31) + 1;
                verse = Math.floor(Math.random() * 25) + 1;
                continue;
            }
            // Se esgotou as tentativas, lança o erro
            throw error;
        }
    }
    throw new Error('Não foi possível buscar versículo após várias tentativas');
}

export async function getMultipleBibleVerses(count: number = 3): Promise<BibleVerse[]> {
    const promises: Promise<BibleVerse>[] = [];
    
    for (let i = 0; i < count; i++) {
        const chapter = Math.floor(Math.random() * 31) + 1;
        const verse = Math.floor(Math.random() * 25) + 1;
        promises.push(getCompleteVerseWithRetry(chapter, verse));
    }
    
    return Promise.all(promises);
}