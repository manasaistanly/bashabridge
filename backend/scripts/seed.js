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
    },
    // GENERAL CONVERSATION
    {
        situation: 'General Conversation',
        phrases: {
            tamil: [
                { en: 'Hello, how are you?', local: 'Vanakkam, epdi irukeenga?', transliteration: 'Va-nak-kam, ep-di i-ru-keen-ga', difficulty: 'beginner' },
                { en: 'My name is...', local: 'En peyar...', transliteration: 'En pe-yar...', difficulty: 'beginner' },
                { en: 'Nice to meet you', local: 'Ungalai sandhithadhil magizhchi', transliteration: 'Un-ga-lai san-dhi-tha-dhil ma-gizh-chi', difficulty: 'intermediate' },
                { en: 'I am learning Tamil', local: 'Naan Tamil padikiren', transliteration: 'Naan Ta-mil pa-di-ki-ren', difficulty: 'beginner' },
                { en: 'Can you help me?', local: 'Enaku udhavi seiya mudiyuma?', transliteration: 'E-na-ku u-dha-vi sei-ya mu-di-yu-ma', difficulty: 'beginner' }
            ],
            telugu: [
                { en: 'Hello, how are you?', local: 'Namaskaram, ela unnaru?', transliteration: 'Na-mas-ka-ram, e-la un-na-ru', difficulty: 'beginner' },
                { en: 'My name is...', local: 'Naa peru...', transliteration: 'Naa pe-ru...', difficulty: 'beginner' },
                { en: 'Nice to meet you', local: 'Mimmalni kalavadam santhosham', transliteration: 'Mim-mal-ni ka-la-va-dam san-tho-sham', difficulty: 'intermediate' },
                { en: 'I am learning Telugu', local: 'Nenu Telugu nerchukuntunnanu', transliteration: 'Ne-nu Te-lu-gu ner-chu-kun-tun-na-nu', difficulty: 'beginner' },
                { en: 'Can you help me?', local: 'Naaku sahayam cheyagalara?', transliteration: 'Naa-ku sa-ha-yam che-ya-ga-la-ra', difficulty: 'beginner' }
            ],
            hindi: [
                { en: 'Hello, how are you?', local: 'Namaste, aap kaise hain?', transliteration: 'Na-mas-te, aap kai-se hain', difficulty: 'beginner' },
                { en: 'My name is...', local: 'Mera naam... hai', transliteration: 'Me-ra naam... hai', difficulty: 'beginner' },
                { en: 'Nice to meet you', local: 'Aapse milkar accha laga', transliteration: 'Aap-se mil-kar ac-cha la-ga', difficulty: 'beginner' },
                { en: 'I am learning Hindi', local: 'Main Hindi seekh raha hoon', transliteration: 'Main Hin-di seekh ra-ha hoon', difficulty: 'beginner' },
                { en: 'Can you help me?', local: 'Kya aap meri madad kar sakte hain?', transliteration: 'Kya aap me-ri ma-dad kar sak-te hain', difficulty: 'beginner' }
            ],
            kannada: [
                { en: 'Hello, how are you?', local: 'Namaskara, hegiddira?', transliteration: 'Na-mas-ka-ra, he-gid-di-ra', difficulty: 'beginner' },
                { en: 'My name is...', local: 'Nanna hesaru...', transliteration: 'Nan-na he-sa-ru...', difficulty: 'beginner' },
                { en: 'Nice to meet you', local: 'Mimmana nodi thumba santhosha', transliteration: 'Mim-ma-na no-di thum-ba san-tho-sha', difficulty: 'intermediate' },
                { en: 'I am learning Kannada', local: 'Naanu Kannada kalitha iddini', transliteration: 'Naa-nu Kan-na-da ka-li-tha id-di-ni', difficulty: 'beginner' },
                { en: 'Can you help me?', local: 'Nanage sahaya maduthira?', transliteration: 'Na-na-ge sa-ha-ya ma-du-thi-ra', difficulty: 'beginner' }
            ],
            malayalam: [
                { en: 'Hello, how are you?', local: 'Namaskaram, sukhamaano?', transliteration: 'Na-mas-ka-ram, su-kha-maa-no', difficulty: 'beginner' },
                { en: 'My name is...', local: 'Ente peru...', transliteration: 'En-te pe-ru...', difficulty: 'beginner' },
                { en: 'Nice to meet you', local: 'Kandathil santhosham', transliteration: 'Kan-da-thil san-tho-sham', difficulty: 'intermediate' },
                { en: 'I am learning Malayalam', local: 'Njan Malayalam padikkunnu', transliteration: 'Njan Ma-la-ya-lam pa-dik-kun-nu', difficulty: 'beginner' },
                { en: 'Can you help me?', local: 'Enne sahayam cheyyamo?', transliteration: 'En-ne sa-ha-yam chey-ya-mo', difficulty: 'beginner' }
            ],
            marathi: [
                { en: 'Hello, how are you?', local: 'Namaskar, tumhi kase ahat?', transliteration: 'Na-mas-kar, tum-hi ka-se a-hat', difficulty: 'beginner' },
                { en: 'My name is...', local: 'Maze naav... ahe', transliteration: 'Ma-ze naav... a-he', difficulty: 'beginner' },
                { en: 'Nice to meet you', local: 'Tumhala bhetun anand zala', transliteration: 'Tum-ha-la bhe-tun a-nand za-la', difficulty: 'intermediate' },
                { en: 'I am learning Marathi', local: 'Mi Marathi shikat ahe', transliteration: 'Mi Ma-ra-thi shi-kat a-he', difficulty: 'beginner' },
                { en: 'Can you help me?', local: 'Tumhi mala madat karal ka?', transliteration: 'Tum-hi ma-la ma-dat ka-ral ka', difficulty: 'beginner' }
            ]
        }
    },
    // MARKET
    {
        situation: 'Market',
        phrases: {
            tamil: [
                { en: 'How much is this?', local: 'Idhu evlo?', transliteration: 'I-dhu ev-lo', difficulty: 'beginner' },
                { en: 'Give me one kilo', local: 'Oru kilo kudunga', transliteration: 'O-ru ki-lo ku-dun-ga', difficulty: 'beginner' },
                { en: 'It is too expensive', local: 'Idhu romba vilai', transliteration: 'I-dhu rom-ba vi-lai', difficulty: 'beginner' },
                { en: 'Is it fresh?', local: 'Idhu fresh-a?', transliteration: 'I-dhu fresh-a', difficulty: 'beginner' },
                { en: 'Do you have bags?', local: 'Bag irukka?', transliteration: 'Bag i-ruk-ka', difficulty: 'beginner' }
            ],
            telugu: [
                { en: 'How much is this?', local: 'Idi entha?', transliteration: 'I-di en-tha', difficulty: 'beginner' },
                { en: 'Give me one kilo', local: 'Okka kilo ivvandi', transliteration: 'Ok-ka ki-lo iv-van-di', difficulty: 'beginner' },
                { en: 'It is too expensive', local: 'Idi chala ekkuva', transliteration: 'I-di cha-la ek-ku-va', difficulty: 'beginner' },
                { en: 'Is it fresh?', local: 'Idi fresh aa?', transliteration: 'I-di fresh aa', difficulty: 'beginner' },
                { en: 'Do you have bags?', local: 'Bag unda?', transliteration: 'Bag un-da', difficulty: 'beginner' }
            ],
            hindi: [
                { en: 'How much is this?', local: 'Yeh kitne ka hai?', transliteration: 'Yeh kit-ne ka hai', difficulty: 'beginner' },
                { en: 'Give me one kilo', local: 'Ek kilo dijiye', transliteration: 'Ek ki-lo di-ji-ye', difficulty: 'beginner' },
                { en: 'It is too expensive', local: 'Yeh bahut mehnga hai', transliteration: 'Yeh ba-hut mehn-ga hai', difficulty: 'beginner' },
                { en: 'Is it fresh?', local: 'Kya yeh taaza hai?', transliteration: 'Kya yeh taa-za hai', difficulty: 'beginner' },
                { en: 'Do you have bags?', local: 'Kya bag hai?', transliteration: 'Kya bag hai', difficulty: 'beginner' }
            ],
            kannada: [
                { en: 'How much is this?', local: 'Idhu yeshtu?', transliteration: 'I-dhu yesh-tu', difficulty: 'beginner' },
                { en: 'Give me one kilo', local: 'Ondu kilo kodi', transliteration: 'On-du ki-lo ko-di', difficulty: 'beginner' },
                { en: 'It is too expensive', local: 'Idhu thumba dubari', transliteration: 'I-dhu thum-ba du-ba-ri', difficulty: 'beginner' },
                { en: 'Is it fresh?', local: 'Idhu fresh aa?', transliteration: 'I-dhu fresh aa', difficulty: 'beginner' },
                { en: 'Do you have bags?', local: 'Bag idya?', transliteration: 'Bag id-ya', difficulty: 'beginner' }
            ],
            malayalam: [
                { en: 'How much is this?', local: 'Ithinu entha vila?', transliteration: 'I-thi-nu en-tha vi-la', difficulty: 'beginner' },
                { en: 'Give me one kilo', local: 'Oru kilo tharoo', transliteration: 'O-ru ki-lo tha-roo', difficulty: 'beginner' },
                { en: 'It is too expensive', local: 'Ithu valare kooduthal aanu', transliteration: 'I-thu va-la-re koo-du-thal aa-nu', difficulty: 'beginner' },
                { en: 'Is it fresh?', local: 'Ithu fresh aano?', transliteration: 'I-thu fresh aa-no', difficulty: 'beginner' },
                { en: 'Do you have bags?', local: 'Bag undo?', transliteration: 'Bag un-do', difficulty: 'beginner' }
            ],
            marathi: [
                { en: 'How much is this?', local: 'He kiti la ahe?', transliteration: 'He ki-ti la a-he', difficulty: 'beginner' },
                { en: 'Give me one kilo', local: 'Ek kilo dya', transliteration: 'Ek ki-lo dya', difficulty: 'beginner' },
                { en: 'It is too expensive', local: 'He khup mahag ahe', transliteration: 'He khup ma-hag a-he', difficulty: 'beginner' },
                { en: 'Is it fresh?', local: 'He fresh ahe ka?', transliteration: 'He fresh a-he ka', difficulty: 'beginner' },
                { en: 'Do you have bags?', local: 'Bag ahe ka?', transliteration: 'Bag a-he ka', difficulty: 'beginner' }
            ]
        }
    },
    // DOCTOR
    {
        situation: 'Doctor',
        phrases: {
            tamil: [
                { en: 'I have a fever', local: 'Enaku kaachal', transliteration: 'E-na-ku kaa-chal', difficulty: 'beginner' },
                { en: 'My stomach hurts', local: 'Vayiru valikudhu', transliteration: 'Va-yi-ru va-li-ku-dhu', difficulty: 'beginner' },
                { en: 'Take this medicine', local: 'Indha maathirai eduthukonga', transliteration: 'In-dha maa-thi-rai e-du-thu-kon-ga', difficulty: 'intermediate' },
                { en: 'Drink hot water', local: 'Sudu thanni kudinga', transliteration: 'Su-du than-ni ku-din-ga', difficulty: 'beginner' },
                { en: 'Come back tomorrow', local: 'Naalaiki vaanga', transliteration: 'Naa-lai-ki vaan-ga', difficulty: 'beginner' }
            ],
            telugu: [
                { en: 'I have a fever', local: 'Naaku jwaram ga undi', transliteration: 'Naa-ku jwa-ram ga un-di', difficulty: 'beginner' },
                { en: 'My stomach hurts', local: 'Kadupu noppi ga undi', transliteration: 'Ka-du-pu nop-pi ga un-di', difficulty: 'beginner' },
                { en: 'Take this medicine', local: 'Ee mandu vesukondi', transliteration: 'Ee man-du ve-su-kon-di', difficulty: 'intermediate' },
                { en: 'Drink hot water', local: 'Vedi neellu thagandi', transliteration: 'Ve-di neel-lu tha-gan-di', difficulty: 'beginner' },
                { en: 'Come back tomorrow', local: 'Repu randi', transliteration: 'Re-pu ran-di', difficulty: 'beginner' }
            ],
            hindi: [
                { en: 'I have a fever', local: 'Mujhe bukhar hai', transliteration: 'Mu-jhe bu-khar hai', difficulty: 'beginner' },
                { en: 'My stomach hurts', local: 'Mere pet mein dard hai', transliteration: 'Me-re pet mein dard hai', difficulty: 'beginner' },
                { en: 'Take this medicine', local: 'Yeh dawai lijiye', transliteration: 'Yeh da-wai li-ji-ye', difficulty: 'intermediate' },
                { en: 'Drink hot water', local: 'Garam paani pijiye', transliteration: 'Ga-ram paa-ni pi-ji-ye', difficulty: 'beginner' },
                { en: 'Come back tomorrow', local: 'Kal aana', transliteration: 'Kal aa-na', difficulty: 'beginner' }
            ],
            kannada: [
                { en: 'I have a fever', local: 'Nanage jvara ide', transliteration: 'Na-na-ge jva-ra i-de', difficulty: 'beginner' },
                { en: 'My stomach hurts', local: 'Hotte novu ide', transliteration: 'Hot-te no-vu i-de', difficulty: 'beginner' },
                { en: 'Take this medicine', local: 'Ee mathre thogolli', transliteration: 'Ee math-re tho-gol-li', difficulty: 'intermediate' },
                { en: 'Drink hot water', local: 'Bisi neeru kudiri', transliteration: 'Bi-si nee-ru ku-di-ri', difficulty: 'beginner' },
                { en: 'Come back tomorrow', local: 'Naale banni', transliteration: 'Naa-le ban-ni', difficulty: 'beginner' }
            ],
            malayalam: [
                { en: 'I have a fever', local: 'Enikku pani aanu', transliteration: 'E-nik-ku pa-ni aa-nu', difficulty: 'beginner' },
                { en: 'My stomach hurts', local: 'Vayar vedhana edukkunnu', transliteration: 'Va-yar ve-dha-na e-duk-kun-nu', difficulty: 'beginner' },
                { en: 'Take this medicine', local: 'Ee marunnu kazhikku', transliteration: 'Ee ma-run-nu ka-zhik-ku', difficulty: 'intermediate' },
                { en: 'Drink hot water', local: 'Choodu vellam kudikku', transliteration: 'Choo-du vel-lam ku-dik-ku', difficulty: 'beginner' },
                { en: 'Come back tomorrow', local: 'Naale varoo', transliteration: 'Naa-le va-roo', difficulty: 'beginner' }
            ],
            marathi: [
                { en: 'I have a fever', local: 'Mala taap ahe', transliteration: 'Ma-la taap a-he', difficulty: 'beginner' },
                { en: 'My stomach hurts', local: 'Maze pot dukhat ahe', transliteration: 'Ma-ze pot du-khat a-he', difficulty: 'beginner' },
                { en: 'Take this medicine', local: 'Hi aushadh ghya', transliteration: 'Hi au-shadh ghya', difficulty: 'intermediate' },
                { en: 'Drink hot water', local: 'Garam paani pya', transliteration: 'Ga-ram paa-ni pya', difficulty: 'beginner' },
                { en: 'Come back tomorrow', local: 'Udya ya', transliteration: 'Ud-ya ya', difficulty: 'beginner' }
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

// Achievements Data
const achievementsData = [
    // Levels
    { code: 'LVL_5', name: 'Rising Star', description: 'Reach Level 5', icon: '⭐', type: 'level', requirement: 5, xpReward: 500 },
    { code: 'LVL_10', name: 'Language Scholar', description: 'Reach Level 10', icon: '🎓', type: 'level', requirement: 10, xpReward: 1000 },
    { code: 'LVL_20', name: 'Language Master', description: 'Reach Level 20', icon: '👑', type: 'level', requirement: 20, xpReward: 2000 },

    // Streaks
    { code: 'STR_3', name: 'Heating Up', description: 'Maintain a 3-day streak', icon: '🔥', type: 'streak', requirement: 3, xpReward: 100 },
    { code: 'STR_7', name: 'On Fire', description: 'Maintain a 7-day streak', icon: '🚀', type: 'streak', requirement: 7, xpReward: 300 },
    { code: 'STR_30', name: 'Unstoppable', description: 'Maintain a 30-day streak', icon: '💎', type: 'streak', requirement: 30, xpReward: 1000 },

    // Milestones (Phrases)
    { code: 'PHR_10', name: 'First Steps', description: 'Complete 10 phrases', icon: '👣', type: 'milestone', requirement: 10, xpReward: 50 },
    { code: 'PHR_50', name: 'Getting Talkative', description: 'Complete 50 phrases', icon: '💬', type: 'milestone', requirement: 50, xpReward: 200 },
    { code: 'PHR_100', name: 'Century Club', description: 'Complete 100 phrases', icon: '💯', type: 'milestone', requirement: 100, xpReward: 500 },

    // Accuracy
    { code: 'ACC_90', name: 'Sharp Ear', description: 'Achieve 90% accuracy in a session', icon: '🎯', type: 'accuracy', requirement: 90, xpReward: 100 }
];

import Achievement from '../models/Achievement.js';

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        await Language.deleteMany({});
        await Phrase.deleteMany({});
        await Achievement.deleteMany({});
        console.log('🗑️  Cleared existing data\n');

        // Insert Achievements
        await Achievement.insertMany(achievementsData);
        console.log(`🏆 Seeded ${achievementsData.length} achievements`);

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

                if (!phrasesForLang) {
                    console.error(`❌ Missing phrases for ${languageKey} in ${situationData.situation}`);
                    continue;
                }


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
