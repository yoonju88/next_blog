import { getWebBanners, getMobileBanners } from "@/app/admin-dashboard/banners/action";
import BannersClient from '@/components/home-banner/Banners';
import ItemSection from "@/components/home/ItemSection";
import { getOnSaleProperties, getRecentProperties } from "@/lib/properties";
import EventCouponBanner from "@/components/home/EventCouponBanner";
import { BannerImage } from "types/banner"

export const revalidate = 60;

const extractImages = (
  items: any[],
  key: 'webImages' | 'mobileImages'
): string[] =>
  (items ?? []).flatMap((b) =>
    (b?.[key] ?? [])
      .map((img: BannerImage) =>
        typeof img === "string" ? img : img?.url
      )
      .filter((url): url is string => Boolean(url))
  );

export default async function Home() {
  const [
    webImages,
    mobileImages,
    recentItems,
    saleItems,
  ] = await Promise.all([
    getWebBanners(),
    getMobileBanners(),
    getRecentProperties(),
    getOnSaleProperties(),
  ]);
  const allWebImages = extractImages(webImages, 'webImages');
  const allMobileImages = extractImages(mobileImages, 'mobileImages');

  // const allWebImages: string[] = (webImages ?? []).flatMap((b) =>
  //   (b.webImages ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
  // );
  // const allMobileImages: string[] = (mobileImages ?? []).flatMap((b) =>
  //   (b.mobileImages ?? []).map((img: any) => (typeof img === "string" ? img : img?.url)).filter(Boolean)
  // );

  return (
    <div className="w-full flex flex-col">
      <EventCouponBanner />
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
      </div>
    </div >
  );
}
