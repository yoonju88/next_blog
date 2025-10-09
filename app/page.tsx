import { getWebBanners, getMobileBanners } from "@/app/admin-dashboard/banners/action";
import BannersClient from '@/components/home-banner/Banners';
import ItemSection from "@/components/home/ItemSection";
import PropertyCard from "@/components/property/PropertyCard";
import { getOnSaleProperties, getRecentProperties } from "@/lib/properties";
import Link from "next/link";


export default async function Home() {
  const webImages = await getWebBanners();
  const mobileImages = await getMobileBanners();
  const recentItems = await getRecentProperties()
  const saleItems = await getOnSaleProperties()

  const allWebImages: string[] = (webImages ?? []).flatMap((b) =>
    (b.images ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
  );
  const allMobileImages: string[] = (mobileImages ?? []).flatMap((b) =>
    (b.images ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
  );

  return (
    <div className="w-full flex flex-col gap-50">
      <BannersClient
        webImages={allWebImages}
        mobileImages={allMobileImages}
      />
      <ItemSection
        data={recentItems}
        title="New Arrivals"
        link="/property?sort=newest"
      />
      <ItemSection
        data={saleItems}
        title="On sale"
        link="/property?sale=true"
      />
    </div >
  );
}
