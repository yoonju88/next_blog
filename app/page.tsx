import { getWebBanners, getMobileBanners } from "@/app/admin-dashboard/banners/action";
import BannersClient from '@/components/home-banner/Banners';

export default async function Home() {
  const webImages = await getWebBanners();
  const mobileImages = await getMobileBanners();

  const allWebImages = webImages.flatMap(web => web.images ?? [])
  const allMobileImages = mobileImages.flatMap(mobile => mobile.images ?? [])

  return (
    <div className="w-full mx-auto mt-10">
      <BannersClient
        webImages={allWebImages}
        mobileImages={allMobileImages}
      />
    </div>
  );
}
