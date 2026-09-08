import dataset from '../data/dataset.json';

declare global {
    interface Window {
        vaniBridge?: {
            translatePhrase: (text: string, targetLang: string) => Promise<{ success: boolean; output: string }>;
            isDesktop?: boolean;
        };
    }
}

interface DatasetEntry {
    hindi: string;
    ho_devanagari?: string;
    sat_devanagari?: string;
    unr_devanagari?: string;
    pos?: string;
}

// Direction 1: Hindi -> Regional Cache
const FORWARD_DATASET_CACHE: Record<string, Record<string, string>> = {
    hoc: {},
    sat: {},
    unr: {},
};

// Direction 2: Regional -> Hindi Reverse Cache
const REVERSE_DATASET_CACHE: Record<string, Record<string, string>> = {
    hoc: {},
    sat: {},
    unr: {},
};

if (Array.isArray(dataset)) {
    (dataset as DatasetEntry[]).forEach((row) => {
        if (!row.hindi) return;
        const hiKey = row.hindi.trim();

        if (row.ho_devanagari) {
            const hoVal = row.ho_devanagari.trim();
            FORWARD_DATASET_CACHE.hoc[hiKey] = hoVal;
            REVERSE_DATASET_CACHE.hoc[hoVal] = hiKey;
        }
        if (row.sat_devanagari) {
            const satVal = row.sat_devanagari.trim();
            FORWARD_DATASET_CACHE.sat[hiKey] = satVal;
            REVERSE_DATASET_CACHE.sat[satVal] = hiKey;
        }
        if (row.unr_devanagari) {
            const unrVal = row.unr_devanagari.trim();
            FORWARD_DATASET_CACHE.unr[hiKey] = unrVal;
            REVERSE_DATASET_CACHE.unr[unrVal] = hiKey;
        }
    });
}

// Built-in vocabulary fallback
const LEXICON: Record<string, Record<string, string>> = {
    hoc: {
        नमस्ते: 'जोहार',
        हेलो: 'जोहार',
        क्या: 'चेनाः',
        तुम: 'अम',
        आप: 'अपे',
        मैं: 'आईंग',
        हम: 'आले',
        बच्चे: 'होनको',
        बच्चों: 'होनको',
        किताब: 'पुथी',
        पानी: 'दाः',
        घर: 'ओड़ाः',
        स्कूल: 'इतुकुल',
        खाना: 'मंडी',
        आज: 'तेइसिंग',
        नाम: 'नुतुम',
    },
    sat: {
        नमस्ते: 'जोहार',
        हेलो: 'जोहार',
        क्या: 'चेत',
        तुम: 'आम',
        आप: 'आपे',
        मैं: 'इंज',
        हम: 'आबो',
        बच्चे: 'गिदराको',
        बच्चों: 'गिदराको',
        किताब: 'पुथी',
        पानी: 'दाः',
        घर: 'ओड़ाः',
        स्कूल: 'आसड़ा',
        खाना: 'दाका',
        आज: 'तेहेंज',
        नाम: 'ञुतूम',
    },
    unr: {
        नमस्ते: 'जोहार',
        हेलो: 'जोहार',
        क्या: 'चिनाः',
        तुम: 'अम',
        आप: 'अपे',
        मैं: 'ऐंग',
        हम: 'अले',
        बच्चे: 'होनको',
        बच्चों: 'होनको',
        किताब: 'पुथी',
        पानी: 'दाः',
        घर: 'ओड़ाः',
        स्कूल: 'इतुकुल',
        खाना: 'मंडी',
        आज: 'तिसिंग',
        नाम: 'नुतुम',
    },
};

// Generate reverse lexicon automatically
const REVERSE_LEXICON: Record<string, Record<string, string>> = {
    hoc: {},
    sat: {},
    unr: {},
};

Object.entries(LEXICON).forEach(([lang, words]) => {
    Object.entries(words).forEach(([hi, tribal]) => {
        REVERSE_LEXICON[lang][tribal] = hi;
    });
});

/**
 * Translates text forward (Hindi -> Regional) or reverse (Regional -> Hindi)
 */
export async function requestTranslation(
    inputText: string,
    langCode: string = 'hoc',
    isReverse: boolean = false
): Promise<string> {
    const clean = inputText.trim();
    if (!clean) return '';

    // 1. Electron bridge execution (forward mode only for native .exe)
    if (!isReverse && typeof window !== 'undefined' && window.vaniBridge?.translatePhrase) {
        try {
            const response = await window.vaniBridge.translatePhrase(clean, langCode);
            if (response && response.success && response.output && response.output.trim().length > 0) {
                return response.output.trim();
            }
        } catch (err) {
            console.warn('Native translation invocation failed, falling back to local dataset:', err);
        }
    }

    // Pick dictionaries based on direction
    const datasetDict = isReverse ? REVERSE_DATASET_CACHE[langCode] || {} : FORWARD_DATASET_CACHE[langCode] || {};
    const fallbackDict = isReverse ? REVERSE_LEXICON[langCode] || {} : LEXICON[langCode] || {};

    // 2. Exact match in dataset
    if (datasetDict[clean]) {
        return datasetDict[clean];
    }

    // 3. Token-by-token dynamic fallback
    const tokens = clean.split(/\s+/);
    const translatedTokens = tokens.map((token) => {
        const stripped = token.replace(/[।,?!]/g, '');
        return datasetDict[stripped] || fallbackDict[stripped] || token;
    });

    return translatedTokens.join(' ');
}

export default requestTranslation;