import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Language from '../models/Language.js';
import Phrase from '../models/Phrase.js';

dotenv.config();

// Sample data for 6 Indian languages
const languagesData = [
    {
        name: 'Tamil',
        code: 'ta',
        nativeScript: 'தமிழ்',
        flag: '🇮🇳',
        region: 'South India (Tamil Nadu, Puducherry)',
        nativeSpeakers: 75000000,
        difficulty: 'intermediate'
    },
    {
        name: 'Telugu',
        code: 'te',
        nativeScript: 'తెలుగు',
        flag: '🇮🇳',
        region: 'South India (Andhra Pradesh, Telangana)',
        nativeSpeakers: 82000000,
        difficulty: 'intermediate'
    },
    {
        name: 'Hindi',
        code: 'hi',
        nativeScript: 'हिंदी',
        flag: '🇮🇳',
        region: 'North India (National Language)',
        nativeSpeakers: 340000000,
        difficulty: 'beginner'
    },
    {
        name: 'Kannada',
        code: 'kn',
        nativeScript: 'ಕನ್ನಡ',
        flag: '🇮🇳',
        region: 'South India (Karnataka)',
        nativeSpeakers: 44000000,
        difficulty: 'intermediate'
    },
    {
        name: 'Malayalam',
        code: 'ml',
        nativeScript: 'മലയാളം',
        flag: '🇮🇳',
        region: 'South India (Kerala)',
        nativeSpeakers: 38000000,
        difficulty: 'advanced'
    },
    {
        name: 'Marathi',
        code: 'mr',
        nativeScript: 'मराठी',
        flag: '🇮🇳',
        region: 'Western India (Maharashtra)',
        nativeSpeakers: 83000000,
        difficulty: 'intermediate'
    }
];

// Situation-based phrases (AI-generated samples)
const phrasesTemplate = [
    // TEA SHOP
    {
        situation: 'Tea Shop',
        phrases: {
            tamil: [
                { en: 'Give me one tea, please', local: 'Oru tea kudunga', transliteration: 'O-ru t-ea kud-u-nga', difficulty: 'beginner' },
                { en: 'How much is the tea?', local: 'Tea evlo?', transliteration: 'T-ea ev-lo', difficulty: 'beginner' },
                { en: 'Make it less sweet', local: 'Konjam kam sweet-a podunga', transliteration: 'Kon-jam kam s-weet-a pod-u-nga', difficulty: 'beginner' },
                { en: 'Do you have coffee?', local: 'Coffee irukka?', transliteration: 'Cof-fee i-ruk-ka', difficulty: 'beginner' },
                { en: 'Give me the bill', local: 'Bill kudunga', transliteration: 'Bill kud-u-nga', difficulty: 'beginner' }
            ],
            telugu: [
                { en: 'Give me one tea, please', local: 'Oka tea ivvandi', transliteration: 'O-ka t-ea iv-van-di', difficulty: 'beginner' },
                { en: 'How much is the tea?', local: 'Tea entha?', transliteration: 'T-ea en-tha', difficulty: 'beginner' },
                { en: 'Make it less sweet', local: 'Thakkuva teepi cheyandi', transliteration: 'Thak-ku-va tee-pi chey-an-di', difficulty: 'beginner' },
                { en: 'Do you have coffee?', local: 'Coffee unda?', transliteration: 'Cof-fee un-da', difficulty: 'beginner' },
                { en: 'Give me the bill', local: 'Bill ivvandi', transliteration: 'Bill iv-van-di', difficulty: 'beginner' }
            ],
            hindi: [
                { en: 'Give me one tea, please', local: 'Ek chai dijiye', transliteration: 'Ek ch-ai di-ji-ye', difficulty: 'beginner' },
                { en: 'How much is the tea?', local: 'Chai kitne ki hai?', transliteration: 'Ch-ai kit-ne ki hai', difficulty: 'beginner' },
                { en: 'Make it less sweet', local: 'Kam meethi banaye', transliteration: 'Kam mee-thi ba-na-ye', difficulty: 'beginner' },
                { en: 'Do you have coffee?', local: 'Coffee hai?', transliteration: 'Cof-fee hai', difficulty: 'beginner' },
                { en: 'Give me the bill', local: 'Bill dijiye', transliteration: 'Bill di-ji-ye', difficulty: 'beginner' }
            ],
            kannada: [
                { en: 'Give me one tea, please', local: 'Ondu tea kodi', transliteration: 'On-du t-ea ko-di', difficulty: 'beginner' },
                { en: 'How much is the tea?', local: 'Tea yeshtu?', transliteration: 'T-ea yesh-tu', difficulty: 'beginner' },
                { en: 'Make it less sweet', local: 'Kammi sweet madi', transliteration: 'Kam-mi s-weet ma-di', difficulty: 'beginner' },
                { en: 'Do you have coffee?', local: 'Coffee ide ya?', transliteration: 'Cof-fee i-de ya', difficulty: 'beginner' },
                { en: 'Give me the bill', local: 'Bill kodi', transliteration: 'Bill ko-di', difficulty: 'beginner' }
            ],
            malayalam: [
                { en: 'Give me one tea, please', local: 'Oru tea tharaamo', transliteration: 'O-ru t-ea tha-raa-mo', difficulty: 'beginner' },
                { en: 'How much is the tea?', local: 'Tea entha vila?', transliteration: 'T-ea en-tha vi-la', difficulty: 'beginner' },
                { en: 'Make it less sweet', local: 'Kurach mathram madhuram', transliteration: 'Ku-rach math-ram madh-u-ram', difficulty: 'beginner' },
                { en: 'Do you have coffee?', local: 'Coffee undo?', transliteration: 'Cof-fee un-do', difficulty: 'beginner' },
                { en: 'Give me the bill', local: 'Bill tharaamo', transliteration: 'Bill tha-raa-mo', difficulty: 'beginner' }
            ],
            marathi: [
                { en: 'Give me one tea, please', local: 'Ek chai dya', transliteration: 'Ek ch-ai dy-a', difficulty: 'beginner' },
                { en: 'How much is the tea?', local: 'Chai kitli?', transliteration: 'Ch-ai kit-li', difficulty: 'beginner' },
                { en: 'Make it less sweet', local: 'Kami god kara', transliteration: 'Ka-mi god ka-ra', difficulty: 'beginner' },
                { en: 'Do you have coffee?', local: 'Coffee ahe ka?', transliteration: 'Cof-fee a-he ka', difficulty: 'beginner' },
                { en: 'Give me the bill', local: 'Bill dya', transliteration: 'Bill dy-a', difficulty: 'beginner' }
            ]
        }
    },
    // BUS STAND
    {
        situation: 'Bus Stand',
        phrases: {
            tamil: [
                { en: 'Which bus goes to Marina Beach?', local: 'Marina Beach ku enda bus pogum?', transliteration: 'Ma-ri-na Beach ku en-da bus po-gum', difficulty: 'beginner' },
                { en: 'How much is the ticket?', local: 'Ticket evlo?', transliteration: 'Tic-ket ev-lo', difficulty: 'beginner' },
                { en: 'When will the bus come?', local: 'Bus eppo varum?', transliteration: 'Bus ep-po va-rum', difficulty: 'beginner' },
                { en: 'Is this the right bus?', local: 'Idhu correct bus dhana?', transliteration: 'I-dhu cor-rect bus dha-na', difficulty: 'beginner' },
                { en: 'Please stop the bus', local: 'Bus-a niruthungo', transliteration: 'Bus-a ni-ruth-un-go', difficulty: 'beginner' }
            ],
            telugu: [
                { en: 'Which bus goes to Marina Beach?', local: 'Marina Beach ku edi bus velthundi?', transliteration: 'Ma-ri-na Beach ku e-di bus vel-thun-di', difficulty: 'beginner' },
                { en: 'How much is the ticket?', local: 'Ticket entha?', transliteration: 'Tic-ket en-tha', difficulty: 'beginner' },
                { en: 'When will the bus come?', local: 'Bus eppudu vasthundi?', transliteration: 'Bus ep-pu-du vas-thun-di', difficulty: 'beginner' },
                { en: 'Is this the right bus?', local: 'Idi correct bus aa?', transliteration: 'I-di cor-rect bus aa', difficulty: 'beginner' },
                { en: 'Please stop the bus', local: 'Bus aapu', transliteration: 'Bus aa-pu', difficulty: 'beginner' }
            ],
            hindi: [
                { en: 'Which bus goes to Connaught Place?', local: 'Connaught Place ki konsi bus jati hai?', transliteration: 'Con-naught Place ki kon-si bus ja-ti hai', difficulty: 'beginner' },
                { en: 'How much is the ticket?', local: 'Ticket kitne ki hai?', transliteration: 'Tic-ket kit-ne ki hai', difficulty: 'beginner' },
                { en: 'When will the bus come?', local: 'Bus kab aayegi?', transliteration: 'Bus kab aa-ye-gi', difficulty: 'beginner' },
                { en: 'Is this the right bus?', local: 'Yeh sahi bus hai?', transliteration: 'Yeh sa-hi bus hai', difficulty: 'beginner' },
                { en: 'Please stop the bus', local: 'Bus rokiye', transliteration: 'Bus ro-ki-ye', difficulty: 'beginner' }
            ],
            kannada: [
                { en: 'Which bus goes to MG Road?', local: 'MG Road ge yavu bus hogatte?', transliteration: 'MG Road ge ya-vu bus ho-gat-te', difficulty: 'beginner' },
                { en: 'How much is the ticket?', local: 'Ticket yeshtu?', transliteration: 'Tic-ket yesh-tu', difficulty: 'beginner' },
                { en: 'When will the bus come?', local: 'Bus eshtu hotte barthide?', transliteration: 'Bus esh-tu hot-te bar-thi-de', difficulty: 'beginner' },
                { en: 'Is this the right bus?', local: 'Idhu correct bus aa?', transliteration: 'I-dhu cor-rect bus aa', difficulty: 'beginner' },
                { en: 'Please stop the bus', local: 'Bus nillisi', transliteration: 'Bus nil-li-si', difficulty: 'beginner' }
            ],
            malayalam: [
                { en: 'Which bus goes to Fort Kochi?', local: 'Fort Kochi povaan enthaa bus?', transliteration: 'Fort Ko-chi po-vaan en-thaa bus', difficulty: 'beginner' },
                { en: 'How much is the ticket?', local: 'Ticket entha vila?', transliteration: 'Tic-ket en-tha vi-la', difficulty: 'beginner' },
                { en: 'When will the bus come?', local: 'Bus eppozha varum?', transliteration: 'Bus ep-po-zha va-rum', difficulty: 'beginner' },
                { en: 'Is this the right bus?', local: 'Ithaa sheriyaaya bus?', transliteration: 'I-thaa she-ri-yaa-ya bus', difficulty: 'beginner' },
                { en: 'Please stop the bus', local: 'Bus nirthungo', transliteration: 'Bus nir-thun-go', difficulty: 'beginner' }
            ],
            marathi: [
                { en: 'Which bus goes to Gateway?', local: 'Gateway la konti bus jate?', transliteration: 'Gate-way la kon-ti bus ja-te', difficulty: 'beginner' },
                { en: 'How much is the ticket?', local: 'Ticket kitli?', transliteration: 'Tic-ket kit-li', difficulty: 'beginner' },
                { en: 'When will the bus come?', local: 'Bus kevha yeil?', transliteration: 'Bus kev-ha yeil', difficulty: 'beginner' },
                { en: 'Is this the right bus?', local: 'Hi bari bus ahe ka?', transliteration: 'Hi ba-ri bus a-he ka', difficulty: 'beginner' },
                { en: 'Please stop the bus', local: 'Bus thamba', transliteration: 'Bus tham-ba', difficulty: 'beginner' }
            ]
        }
    },
    // RESTAURANT
    {
        situation: 'Restaurant',
        phrases: {
            tamil: [
                { en: 'What do you have for lunch?', local: 'Lunch-ku enna irukku?', transliteration: 'Lunch-ku en-na i-ruk-ku', difficulty: 'beginner' },
                { en: 'This is too spicy', local: 'Idhu romba kaaram', transliteration: 'I-dhu rom-ba kaa-ram', difficulty: 'beginner' },
                { en: 'Bring one more plate', local: 'Inoru plate kondu vanga', transliteration: 'I-no-ru plate kon-du van-ga', difficulty: 'beginner' },
                { en: 'Is it vegetarian?', local: 'Idhu vegetarian-a?', transliteration: 'I-dhu ve-ge-ta-rian-a', difficulty: 'beginner' },
                { en: 'The food is delicious', local: 'Saapadu romba nalla irukku', transliteration: 'Saa-pa-du rom-ba nal-la i-ruk-ku', difficulty: 'beginner' }
            ],
            telugu: [
                { en: 'What do you have for lunch?', local: 'Lunch ki emundi?', transliteration: 'Lunch ki e-mun-di', difficulty: 'beginner' },
                { en: 'This is too spicy', local: 'Idi chala karam', transliteration: 'I-di cha-la ka-ram', difficulty: 'beginner' },
                { en: 'Bring one more plate', local: 'Inko plate tecchandi', transliteration: 'In-ko plate tec-chan-di', difficulty: 'beginner' },
                { en: 'Is it vegetarian?', local: 'Idi vegetarian aa?', transliteration: 'I-di ve-ge-ta-rian aa', difficulty: 'beginner' },
                { en: 'The food is delicious', local: 'Annam chala bagundi', transliteration: 'An-nam cha-la ba-gun-di', difficulty: 'beginner' }
            ],
            hindi: [
                { en: 'What do you have for lunch?', local: 'Lunch mein kya hai?', transliteration: 'Lunch mein kya hai', difficulty: 'beginner' },
                { en: 'This is too spicy', local: 'Yeh bahut teekha hai', transliteration: 'Yeh ba-hut tee-kha hai', difficulty: 'beginner' },
                { en: 'Bring one more plate', local: 'Ek aur plate laiye', transliteration: 'Ek aur plate la-i-ye', difficulty: 'beginner' },
                { en: 'Is it vegetarian?', local: 'Yeh vegetarian hai?', transliteration: 'Yeh ve-ge-ta-rian hai', difficulty: 'beginner' },
                { en: 'The food is delicious', local: 'Khana bahut tasty hai', transliteration: 'Kha-na ba-hut tas-ty hai', difficulty: 'beginner' }
            ],
            kannada: [
                { en: 'What do you have for lunch?', local: 'Lunch ge yenu ide?', transliteration: 'Lunch ge ye-nu i-de', difficulty: 'beginner' },
                { en: 'This is too spicy', local: 'Idhu thumba kaara', transliteration: 'I-dhu thum-ba kaa-ra', difficulty: 'beginner' },
                { en: 'Bring one more plate', local: 'Innondu plate togondi', transliteration: 'In-non-du plate to-gon-di', difficulty: 'beginner' },
                { en: 'Is it vegetarian?', local: 'Idhu vegetarian aa?', transliteration: 'I-dhu ve-ge-ta-rian aa', difficulty: 'beginner' },
                { en: 'The food is delicious', local: 'Oota thumba chennagide', transliteration: 'Oo-ta thum-ba chen-na-gi-de', difficulty: 'beginner' }
            ],
            malayalam: [
                { en: 'What do you have for lunch?', local: 'Lunch-inu enthokke undu?', transliteration: 'Lunch-i-nu en-thok-ke un-du', difficulty: 'beginner' },
                { en: 'This is too spicy', local: 'Ithu valare uruppanu', transliteration: 'I-thu va-la-re u-rup-pa-nu', difficulty: 'beginner' },
                { en: 'Bring one more plate', local: 'Vere oru plate tharamo', transliteration: 'Ve-re o-ru plate tha-ra-mo', difficulty: 'beginner' },
                { en: 'Is it vegetarian?', local: 'Ithu vegetarian aano?', transliteration: 'I-thu ve-ge-ta-rian aa-no', difficulty: 'beginner' },
                { en: 'The food is delicious', local: 'Oonu valare nannayitundu', transliteration: 'Oo-nu va-la-re nan-na-yi-tun-du', difficulty: 'beginner' }
            ],
            marathi: [
                { en: 'What do you have for lunch?', local: 'Lunch la kay ahe?', transliteration: 'Lunch la kay a-he', difficulty: 'beginner' },
                { en: 'This is too spicy', local: 'He khup tikhat ahe', transliteration: 'He khup tik-hat a-he', difficulty: 'beginner' },
                { en: 'Bring one more plate', local: 'Aani ek plate ghe ya', transliteration: 'Aa-ni ek plate ghe ya', difficulty: 'beginner' },
                { en: 'Is it vegetarian?', local: 'He vegetarian ahe ka?', transliteration: 'He ve-ge-ta-rian a-he ka', difficulty: 'beginner' },
                { en: 'The food is delicious', local: 'Jevan khup chaan ahe', transliteration: 'Je-van khup chaan a-he', difficulty: 'beginner' }
            ]
        }
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        await Language.deleteMany({});
        await Phrase.deleteMany({});
        console.log('🗑️  Cleared existing data\n');

        // Insert languages
        const languageCodeMap = {
            tamil: 'ta',
            telugu: 'te',
            hindi: 'hi',
            kannada: 'kn',
            malayalam: 'ml',
            marathi: 'mr'
        };

        for (const langData of languagesData) {
            const language = await Language.create(langData);
            console.log(`✅ Created language: ${langData.name} (${langData.nativeScript})`);

            // Insert phrases for this language
            let totalPhrases = 0;
            const situations = new Set();

            for (const situationData of phrasesTemplate) {
                const languageKey = Object.keys(languageCodeMap).find(
                    key => languageCodeMap[key] === langData.code
                );

                const phrasesForLang = situationData.phrases[languageKey];

                for (let i = 0; i < phrasesForLang.length; i++) {
                    const phraseData = phrasesForLang[i];
                    await Phrase.create({
                        languageId: language._id,
                        situation: situationData.situation,
                        english: phraseData.en,
                        local: phraseData.local,
                        transliteration: phraseData.transliteration,
                        difficulty: phraseData.difficulty,
                        order: i + 1,
                        tags: [situationData.situation.toLowerCase().replace(' ', '-')]
                    });
                    totalPhrases++;
                    situations.add(situationData.situation);
                }
            }

            // Update language stats
            language.totalPhrases = totalPhrases;
            language.totalSituations = situations.size;
            await language.save();

            console.log(`   📝 Added ${totalPhrases} phrases across ${situations.size} situations\n`);
        }

        console.log('🎉 Database seeded successfully!');
        console.log(`📊 Total: ${languagesData.length} languages with phrases\n`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
};

// Run seeding
connectDB().then(seedDatabase);
