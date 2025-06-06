import { getWebBanners, getMobileBanners } from "@/app/admin-dashboard/banners/action";
import BannersClient from '@/components/home-banner/Banners';
import RecentProperties from "@/components/home/RecentProperties";
import { getRecentProperies } from "@/lib/properties";

export default async function Home() {
  const webImages = await getWebBanners();
  const mobileImages = await getMobileBanners();
  const recentItems = await getRecentProperies()

  const allWebImages = webImages.flatMap(web => web.images ?? [])
  const allMobileImages = mobileImages.flatMap(mobile => mobile.images ?? [])

  return (
    <div className="w-full mx-auto mt-10 flex flex-col gap-20">
      <BannersClient
        webImages={allWebImages}
        mobileImages={allMobileImages}
      />
      <section>
        <h1 className="text-foreground text-4xl text-center font-bold">New Arrivals</h1>
        <RecentProperties items={recentItems} />
      </section>
      <div></div>
    </div>
  );
}
