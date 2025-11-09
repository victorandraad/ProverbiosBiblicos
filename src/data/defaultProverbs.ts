import { BibleVerse } from "../models/BibleVerse";

export const defaultProverbs: BibleVerse[] = [
    {
        reference: "Provérbios 1:7",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 1,
            text: "O temor do Senhor é o princípio do conhecimento; os loucos desprezam a sabedoria e a instrução.",
        }],
        text: "O temor do Senhor é o princípio do conhecimento; os loucos desprezam a sabedoria e a instrução.",
    },
    {
        reference: "Provérbios 3:5-6",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 3,
            text: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará suas veredas.",
        }],
        text: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará suas veredas.",
    },
    {
        reference: "Provérbios 4:23",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 4,
            text: "Acima de tudo, guarde o seu coração, pois dele depende toda a sua vida.",
        }],
        text: "Acima de tudo, guarde o seu coração, pois dele depende toda a sua vida.",
    },
    {
        reference: "Provérbios 10:12",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 10,
            text: "O ódio provoca dissensão, mas o amor cobre todos os pecados.",
        }],
        text: "O ódio provoca dissensão, mas o amor cobre todos os pecados.",
    },
    {
        reference: "Provérbios 11:2",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 11,
            text: "Quando vem o orgulho, vem a desgraça, mas com a humildade vem a sabedoria.",
        }],
        text: "Quando vem o orgulho, vem a desgraça, mas com a humildade vem a sabedoria.",
    },
    {
        reference: "Provérbios 13:20",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 13,
            text: "Quem anda com os sábios será sábio, mas o companheiro dos tolos sofrerá dano.",
        }],
        text: "Quem anda com os sábios será sábio, mas o companheiro dos tolos sofrerá dano.",
    },
    {
        reference: "Provérbios 15:1",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 15,
            text: "A resposta calma desvia a fúria, mas a palavra ríspida desperta a ira.",
        }],
        text: "A resposta calma desvia a fúria, mas a palavra ríspida desperta a ira.",
    },
    {
        reference: "Provérbios 16:3",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 16,
            text: "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.",
        }],
        text: "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.",
    },
    {
        reference: "Provérbios 17:17",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 17,
            text: "O amigo ama em todos os momentos; é um irmão na adversidade.",
        }],
        text: "O amigo ama em todos os momentos; é um irmão na adversidade.",
    },
    {
        reference: "Provérbios 22:6",
        verses: [{
            book_id: 20,
            book_name: "Provérbios",
            chapter: 22,
            text: "Instrua a criança no caminho em que deve andar, e até o fim da vida não se desviará dele.",
        }],
        text: "Instrua a criança no caminho em que deve andar, e até o fim da vida não se desviará dele.",
    },
];

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}