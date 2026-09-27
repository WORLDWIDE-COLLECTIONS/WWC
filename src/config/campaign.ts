/**
 * Campaign imagery for the storefront homepage.
 *
 * Placeholder art direction only — swap these for the brand's own shoot when
 * it lands. Every URL below is a verified, live stock asset.
 */
const pexels = (id: number, width: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const campaignImages = {
  hero: pexels(10037708, 1920),
  categoryMen: pexels(7779763, 1200),
  categoryWomen: pexels(1066171, 1200),
  featuredMain: pexels(35596695, 1400),
  featuredInset: pexels(10356436, 800),
  promo: pexels(31823166, 1920),
} as const;

/** Editorial gallery strip — static placeholders, no social API. */
export const galleryImages = [
  { id: 31172334, alt: "Close-up of pleated fabric in motion" },
  { id: 11844304, alt: "Two models posing in a bright studio" },
  { id: 35024256, alt: "Model in a yellow shirt against a red backdrop" },
  { id: 31870834, alt: "Model in a cobalt gown against a concrete wall" },
  { id: 2907034, alt: "Beachside look shot at golden hour" },
  { id: 19138128, alt: "Portrait of a model in an evening look" },
].map((image) => ({
  ...image,
  url: pexels(image.id, 800),
}));
