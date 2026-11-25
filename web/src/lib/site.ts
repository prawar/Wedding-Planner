// Central place for values that are not decided yet. Replace before launch.
export const site = {
  name: "YourBrand", // TODO: final brand name
  tagline: "Fill one form. Get a wedding website and a video invite.",
  contact: "hello@example.com", // TODO: real contact
  // TODO: set real prices (in rupees). null renders as "Price to be set".
  prices: { website: null as number | null, websiteAndVideo: null as number | null },
};

export function formatPrice(value: number | null): string {
  return value === null ? "₹ —" : `₹${value.toLocaleString("en-IN")}`;
}
