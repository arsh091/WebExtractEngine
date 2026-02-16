export const phonePatterns = [
    // Indian numbers: +91 9999999999, 9999999999
    '(\\+91[\\-\\s]?)?[6-9]\\d{9}',
    '(0)?[6-9]\\d{9}',

    // International formats (Simplified for speed)
    '\\+?\\d{1,3}[\\s\\-\\.]?\\(?\\d{1,4}\\)?[\\s\\-\\.]?\\d{1,4}[\\s\\-\\.]?\\d{1,4}',

    // USA formats
    '\\(?\\d{3}\\)?[\\-\\s]?\\d{3}[\\-\\s]?\\d{4}'
];

export const emailPattern =
    '[a-zA-Z0-9._%+\\-]+(?:\\s*[@\\[({]at[\\])}]\\s*|[\\s@])[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,10}';

export const addressPatterns = [
    // US/Common Style
    '\\d{1,5}\\s+[A-Za-z0-9\\.\\s,]{5,70}(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd|Way|Court|Ct|Circle|Plaza|Square)[,\\s]+[A-Za-z0-9\\s,]{2,50}\\d{5,6}',

    // Indian/International Style (Sector/Plot/Phase/Building)
    '(?:Plot|Phase|Sector|Building|Bldg|Flat|Room|Suite)\\s*#?\\s*[A-Za-z0-9\\-\\.\\s]{1,10}[,\\s]+[A-Za-z0-9\\.\\s,]{10,100}[\\s,]+\\d{5,6}',

    // Generic City/State/Code
    '[A-Za-z0-9\\s,]{10,100}[,\\s]+[A-Za-z\\s]{2,20}[\\s,]+\\d{5,6}'
];
