// Match complete device labels, never a device word inside a person's name.
export const ZOOM_DEVICE_NAME =
  /^(?:(?:my |user[’']?s? )?(?:iphone(?:\s*\d{1,2})?(?: pro(?: max)?| plus| mini)?|ipad(?: pro| air| mini)?(?:\s*\d{1,2})?|ipod(?: touch)?|macbook(?: pro| air)?|samsung(?: galaxy)?(?: [a-z]?\d{1,3}(?:s| ultra| plus| fe|\+)?(?: 5g)?)?|galaxy(?: [a-z]?\d{1,3}(?:s| ultra| plus| fe|\+)?(?: 5g)?)?|android(?: phone| tablet)?|redmi(?: note)?(?: \d{1,2}(?: pro(?: plus)?|s|c)?(?: 5g)?)?|poco(?: [a-z]\d{1,2}(?: pro)?)?|oppo(?: [a-z]?\d{1,3}(?: pro)?)?|vivo(?: [a-z]?\d{1,3}(?: pro)?)?|realme(?: \d{1,2}(?: pro)?)?|huawei(?: [a-z]?\d{1,3}(?: pro)?)?|honor(?: [a-z]?\d{1,3}(?: lite| pro)?)?|xiaomi(?: \d{1,2}(?: pro)?)?|infinix(?: hot| note| smart)?(?: \d{1,2}(?: pro|i)?)?|tecno(?: spark| camon| pop)?(?: \d{1,2}(?: pro)?)?|pixel(?: [0-9]{1,2}(?: pro(?: xl)?|a)?)?|samsung sm-[a-z0-9-]+|sm-[a-z0-9-]+|zoom user|zoomuser|user|guest|windows(?: pc)?|desktop-[a-z0-9]+|laptop-[a-z0-9]+))$/iu;

// Explicitly excluded by the teacher for this workspace's Zoom reports.
export const EXCLUDED_ZOOM_NAMES = new Set(['helen', 'naw su thinzar maung']);
export const ZOOM_ROLE_NAME = /\s*\(\s*(?:host|co[ -]?host)\s*\)\s*$/iu;
export const ZOOM_MATCHING_RULE = 'name-v1';
export const MAX_ZOOM_NAME_LENGTH = 200;
export const MAX_ZOOM_NAMES_PER_STUDENT = 50;
