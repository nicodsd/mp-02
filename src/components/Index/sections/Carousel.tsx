"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import PromoDayCard from "@/src/components/PromoDay";
import {
  PromoMetadata,
  loadStoredPromoMeta,
  inferPromoMeta,
} from "@/src/components/dashboard/components/promoComponents/promoUtils";

function Carousel({ foods, template }: { foods: any[]; template: any }) {
  const [promoMetaMap, setPromoMetaMap] = useState<Record<string, PromoMetadata>>({});
  const [clientNow, setClientNow] = useState<number | null>(null);

  useEffect(() => {
    setPromoMetaMap(loadStoredPromoMeta());
    setClientNow(Date.now());
  }, [foods]);

  const slides = useMemo(() => {
    return foods
      .filter((f) => {
        if (!f.is_promo) return false;
        if (clientNow !== null) {
          const stored = promoMetaMap[String(f._id)];
          const expiresAt = f.promo_expires_at ?? stored?.expiresAt ?? null;
          if (typeof expiresAt === "number" && expiresAt <= clientNow) return false;
        }
        return true;
      })
      .map((f) => {
        const inferred = inferPromoMeta(f, promoMetaMap);
        const meta: PromoMetadata = {
          ...inferred,
          mode: f.promo_type || inferred.mode,
          badge: f.promo_badge || inferred.badge,
          expiresAt: f.promo_expires_at ?? inferred.expiresAt,
          occasionTag: f.occasion_tag || inferred.occasionTag,
        };
        return { food: f, meta };
      });
  }, [foods, promoMetaMap]);

  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (current >= slides.length && slides.length > 0) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    autoPlayRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [current, slides.length]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  if (slides.length === 0) return null;

  return (
    <section className="flex flex-col items-center w-full h-auto overflow-hidden group">
      <div
        className="flex w-full cursor-grab active:cursor-grabbing transition-transform duration-100 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slides.map(({ food, meta }, index) => (
          <div key={food._id || index} className="min-w-full shrink-0 px-1">
            <PromoDayCard foods={food} template={template} promoMeta={meta} />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center h-4 gap-1 mt-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? `${template?.accentColors?.[0] || "bg-primary"} w-8 h-2.5`
                  : `${template?.backgroundColor2 || "bg-gray-300"} w-2`
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Carousel;
