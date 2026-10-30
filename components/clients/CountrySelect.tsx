'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'

export const ALL_COUNTRIES: string[] = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Congo-Brazzaville)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia (Czech Republic)',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Holy See',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine State',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  Afghanistan: 'AFN',
  Albania: 'ALL',
  Algeria: 'DZD',
  Andorra: 'EUR',
  Angola: 'AOA',
  'Antigua and Barbuda': 'XCD',
  Argentina: 'ARS',
  Armenia: 'AMD',
  Australia: 'AUD',
  Austria: 'EUR',
  Azerbaijan: 'AZN',
  Bahamas: 'BSD',
  Bahrain: 'BHD',
  Bangladesh: 'BDT',
  Barbados: 'BBD',
  Belarus: 'BYN',
  Belgium: 'EUR',
  Belize: 'BZD',
  Benin: 'XOF',
  Bhutan: 'BTN',
  Bolivia: 'BOB',
  'Bosnia and Herzegovina': 'BAM',
  Botswana: 'BWP',
  Brazil: 'BRL',
  Brunei: 'BND',
  Bulgaria: 'BGN',
  'Burkina Faso': 'XOF',
  Burundi: 'BIF',
  'Cabo Verde': 'CVE',
  Cambodia: 'KHR',
  Cameroon: 'XAF',
  Canada: 'CAD',
  'Central African Republic': 'XAF',
  Chad: 'XAF',
  Chile: 'CLP',
  China: 'CNY',
  Colombia: 'COP',
  Comoros: 'KMF',
  'Congo (Congo-Brazzaville)': 'XAF',
  'Costa Rica': 'CRC',
  Croatia: 'EUR',
  Cuba: 'CUP',
  Cyprus: 'EUR',
  'Czechia (Czech Republic)': 'CZK',
  'Democratic Republic of the Congo': 'CDF',
  Denmark: 'DKK',
  Djibouti: 'DJF',
  Dominica: 'XCD',
  'Dominican Republic': 'DOP',
  Ecuador: 'USD',
  Egypt: 'EGP',
  'El Salvador': 'USD',
  'Equatorial Guinea': 'XAF',
  Eritrea: 'ERN',
  Estonia: 'EUR',
  Eswatini: 'SZL',
  Ethiopia: 'ETB',
  Fiji: 'FJD',
  Finland: 'EUR',
  France: 'EUR',
  Gabon: 'XAF',
  Gambia: 'GMD',
  Georgia: 'GEL',
  Germany: 'EUR',
  Ghana: 'GHS',
  Greece: 'EUR',
  Grenada: 'XCD',
  Guatemala: 'GTQ',
  Guinea: 'GNF',
  'Guinea-Bissau': 'XOF',
  Guyana: 'GYD',
  Haiti: 'HTG',
  'Holy See': 'EUR',
  Honduras: 'HNL',
  Hungary: 'HUF',
  Iceland: 'ISK',
  India: 'INR',
  Indonesia: 'IDR',
  Iran: 'IRR',
  Iraq: 'IQD',
  Ireland: 'EUR',
  Israel: 'ILS',
  Italy: 'EUR',
  'Ivory Coast': 'XOF',
  Jamaica: 'JMD',
  Japan: 'JPY',
  Jordan: 'JOD',
  Kazakhstan: 'KZT',
  Kenya: 'KES',
  Kiribati: 'AUD',
  Kuwait: 'KWD',
  Kyrgyzstan: 'KGS',
  Laos: 'LAK',
  Latvia: 'EUR',
  Lebanon: 'LBP',
  Lesotho: 'LSL',
  Liberia: 'LRD',
  Libya: 'LYD',
  Liechtenstein: 'CHF',
  Lithuania: 'EUR',
  Luxembourg: 'EUR',
  Madagascar: 'MGA',
  Malawi: 'MWK',
  Malaysia: 'MYR',
  Maldives: 'MVR',
  Mali: 'XOF',
  Malta: 'EUR',
  'Marshall Islands': 'USD',
  Mauritania: 'MRU',
  Mauritius: 'MUR',
  Mexico: 'MXN',
  Micronesia: 'USD',
  Moldova: 'MDL',
  Monaco: 'EUR',
  Mongolia: 'MNT',
  Montenegro: 'EUR',
  Morocco: 'MAD',
  Mozambique: 'MZN',
  'Myanmar (Burma)': 'MMK',
  Namibia: 'NAD',
  Nauru: 'AUD',
  Nepal: 'NPR',
  Netherlands: 'EUR',
  'New Zealand': 'NZD',
  Nicaragua: 'NIO',
  Niger: 'XOF',
  Nigeria: 'NGN',
  'North Korea': 'KPW',
  'North Macedonia': 'MKD',
  Norway: 'NOK',
  Oman: 'OMR',
  Pakistan: 'PKR',
  Palau: 'USD',
  'Palestine State': 'ILS',
  Panama: 'USD',
  'Papua New Guinea': 'PGK',
  Paraguay: 'PYG',
  Peru: 'PEN',
  Philippines: 'PHP',
  Poland: 'PLN',
  Portugal: 'EUR',
  Qatar: 'QAR',
  Romania: 'RON',
  Russia: 'RUB',
  Rwanda: 'RWF',
  'Saint Kitts and Nevis': 'XCD',
  'Saint Lucia': 'XCD',
  'Saint Vincent and the Grenadines': 'XCD',
  Samoa: 'WST',
  'San Marino': 'EUR',
  'Sao Tome and Principe': 'STN',
  'Saudi Arabia': 'SAR',
  Senegal: 'XOF',
  Serbia: 'RSD',
  Seychelles: 'SCR',
  'Sierra Leone': 'SLE',
  Singapore: 'SGD',
  Slovakia: 'EUR',
  Slovenia: 'EUR',
  'Solomon Islands': 'SBD',
  Somalia: 'SOS',
  'South Africa': 'ZAR',
  'South Korea': 'KRW',
  'South Sudan': 'SSP',
  Spain: 'EUR',
  'Sri Lanka': 'LKR',
  Sudan: 'SDG',
  Suriname: 'SRD',
  Sweden: 'SEK',
  Switzerland: 'CHF',
  Syria: 'SYP',
  Tajikistan: 'TJS',
  Tanzania: 'TZS',
  Thailand: 'THB',
  'Timor-Leste': 'USD',
  Togo: 'XOF',
  Tonga: 'TOP',
  'Trinidad and Tobago': 'TTD',
  Tunisia: 'TND',
  Turkey: 'TRY',
  Turkmenistan: 'TMT',
  Tuvalu: 'AUD',
  Uganda: 'UGX',
  Ukraine: 'UAH',
  'United Arab Emirates': 'AED',
  'United Kingdom': 'GBP',
  'United States': 'USD',
  Uruguay: 'UYU',
  Uzbekistan: 'UZS',
  Vanuatu: 'VUV',
  Venezuela: 'VES',
  Vietnam: 'VND',
  Yemen: 'YER',
  Zambia: 'ZMW',
  Zimbabwe: 'ZWL',
  USA: 'USD',
  US: 'USD',
  UK: 'GBP',
  UAE: 'AED',
}

/**
 * Returns the matching currency code (e.g. 'PKR', 'USD') for a given country name,
 * supporting exact and case-insensitive matches.
 */
export function getCurrencyForCountry(countryName: string): string | null {
  if (!countryName || !countryName.trim()) return null
  const trimmed = countryName.trim()
  if (COUNTRY_TO_CURRENCY[trimmed]) {
    return COUNTRY_TO_CURRENCY[trimmed]
  }
  const lower = trimmed.toLowerCase()
  for (const [c, cur] of Object.entries(COUNTRY_TO_CURRENCY)) {
    if (c.toLowerCase() === lower) {
      return cur
    }
  }
  return null
}

interface CountrySelectProps {
  value: string
  onChange: (value: string) => void
  name?: string
  placeholder?: string
  className?: string
}

export function CountrySelect({
  value,
  onChange,
  name = 'country',
  placeholder = 'Select or type country...',
  className = '',
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Filter countries according to input text
  const filteredCountries = useMemo(() => {
    if (!value || !value.trim()) return ALL_COUNTRIES
    const q = value.trim().toLowerCase()
    return ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(q))
  }, [value])

  const handleSelectCountry = (country: string) => {
    onChange(country)
    setIsOpen(false)
  }

  const isExactMatch = useMemo(() => {
    if (!value.trim()) return false
    return ALL_COUNTRIES.some((c) => c.toLowerCase() === value.trim().toLowerCase())
  }, [value])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          name={name}
          autoComplete="off"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-placeholder focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary pr-9 transition"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {value && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              className="text-muted-foreground hover:text-foreground transition p-0.5 rounded"
              title="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground transition p-0.5 rounded"
            title="Toggle countries list"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-2xl backdrop-blur-md">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((c) => {
              const selected = value.trim().toLowerCase() === c.toLowerCase()
              const currencyCode = COUNTRY_TO_CURRENCY[c]
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSelectCountry(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                    selected
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="truncate">{c}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {currencyCode && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground">
                        {currencyCode}
                      </span>
                    )}
                    {selected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                </button>
              )
            })
          ) : (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No matching countries found.
            </div>
          )}

          {value.trim() && !isExactMatch && (
            <div className="px-3 py-1.5 text-[11px] text-muted-foreground border-t border-border/50 mt-1">
              Custom entry: <span className="font-semibold text-foreground">&quot;{value}&quot;</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
