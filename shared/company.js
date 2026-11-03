// Verified company facts. Used by both the website and the email server.
export const company = {
  name: 'Abib Plumbing & Building Management Ltd',
  shortName: 'Abib',
  addressLines: ['160 Jhumat House', 'London Road', 'Barking', 'England', 'IG11 8BB'],
  address: '160 Jhumat House, London Road, Barking, England, IG11 8BB',
  phone: '020 3488 4332',
  phoneHref: 'tel:+442034884332',
  email: 'info@abibltd.co.uk',
  hrEmail: 'hr@abibltd.co.uk',
  website: 'www.abibltd.co.uk',
  url: 'https://www.abibltd.co.uk',
}

const mapQuery = encodeURIComponent('160 Jhumat House, London Road, Barking IG11 8BB')

export const maps = {
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`,
  search: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  embed: `https://www.google.com/maps?q=${mapQuery}&output=embed`,
}
