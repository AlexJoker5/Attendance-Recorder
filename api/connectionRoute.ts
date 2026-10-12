const DIRECT_COUNTRIES = new Set(
  (
    'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ ' +
    'BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM ' +
    'DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS ' +
    'GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN ' +
    'KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MN MO MP MQ ' +
    'MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM ' +
    'PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV ' +
    'SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI ' +
    'VN VU WF WS YE YT ZA ZM ZW'
  ).split(' '),
);

export const config = { runtime: 'edge' };

export default async function handler(req: any, res?: any) {
  const responseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'private, no-store',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };

  try {
    const getHeader = (name: string): string => {
      if (!req) return '';
      if (typeof req.headers?.get === 'function') {
        return req.headers.get(name) || '';
      }
      if (req.headers && typeof req.headers === 'object') {
        const val = req.headers[name.toLowerCase()] ?? req.headers[name];
        return Array.isArray(val) ? val[0] : (val || '');
      }
      return '';
    };

    const method = req?.method ?? 'GET';
    if (method !== 'GET') {
      if (res && typeof res.status === 'function') {
        return res.status(405).json({ error: 'Method not allowed.' });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
        status: 405,
        headers: { ...responseHeaders, Allow: 'GET' },
      });
    }

    const country = getHeader('x-vercel-ip-country').trim().toUpperCase();
    const route = country && country !== 'MM' && DIRECT_COUNTRIES.has(country) ? 'direct' : 'worker';

    if (res && typeof res.status === 'function') {
      Object.entries(responseHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(200).json({ route });
    }

    return new Response(JSON.stringify({ route }), {
      status: 200,
      headers: responseHeaders,
    });
  } catch {
    if (res && typeof res.status === 'function') {
      return res.status(200).json({ route: 'worker' });
    }
    return new Response(JSON.stringify({ route: 'worker' }), {
      status: 200,
      headers: responseHeaders,
    });
  }
}
