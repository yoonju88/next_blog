import { getWebBanners, getMobileBanners } from "@/app/admin-dashboard/banners/action";
import BannersClient from '@/components/home-banner/Banners';
import PropertyCard from "@/components/property/PropertyCard";
import { getRecentProperies } from "@/lib/properties";
import Link from "next/link";
import { ChevronRight } from 'lucide-react';

export default async function Home() {
  const webImages = await getWebBanners();
  const mobileImages = await getMobileBanners();
  const recentItems = await getRecentProperies()

  const allWebImages: string[] = (webImages ?? []).flatMap((b) =>
    (b.images ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
  );
  const allMobileImages: string[] = (mobileImages ?? []).flatMap((b) =>
    (b.images ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
  );

  const hoverEffect = "transition-all duration-300"

  return (
    <div className="w-full flex flex-col gap-20">
      <BannersClient
        webImages={allWebImages}
        mobileImages={allMobileImages}
      />
      <section className="w-full">
        <h1 className="text-foreground text-4xl text-center font-bold">New Arrivals</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-14'>
          {recentItems.map((item) => (
            <PropertyCard
              key={item.id}
              property={item}
              actionButton={
                <button
                  type="button"
                  className={`shrink-0 rounded-2xl bg-primary/10 p-1 hover:bg-primary/20 hover:shadow-sm ${hoverEffect}`}
                >
                  <Link href={`/property/${item.id}`}>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </button>
              }
            />
          ))
          }
        </div >
      </section>
    </div>
  );
}
