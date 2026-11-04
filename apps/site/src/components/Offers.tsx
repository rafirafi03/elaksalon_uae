import { getOffers } from "@/lib/offers";
import OffersList from "@/components/OffersList";

/** "Special offers" section shown under the hero. Renders nothing when no offer is live. */
export default async function Offers() {
  const offers = await getOffers();
  if (offers.length === 0) return null;
  return <OffersList offers={offers} />;
}
