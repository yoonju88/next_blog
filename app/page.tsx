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

  const hoverEffect = "transition-all duration-300"

  return (
    <div className="w-full flex flex-col gap-50">
      <BannersClient
        webImages={allWebImages}
        mobileImages={allMobileImages}
      />
      <section>
        <h1 className="text-foreground text-4xl text-center font-bold">
          <Link href="/property?sort=newest">
            New Arrivals
          </Link>
        </h1>
        <ItemSection data={recentItems} />
      </section>
      <section>
        <h1 className="text-foreground text-4xl text-center font-bold">
          <Link href="/property?sale=true">
            On sale
          </Link>
        </h1>
        <ItemSection data={saleItems} />
      </section >
    </div >
  );
}
