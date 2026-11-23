"use client";
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { FaTags, FaLayerGroup } from "react-icons/fa";
import { useFoodStore } from "@/src/lib/useFoodStore";
import { refreshPage } from "@/app/actions";
import PromoStatsHeader from "./components/promoComponents/PromoStatsHeader";
import ActivePromosSection from "./components/promoComponents/ActivePromosSection";
import ProductPromoGrid from "./components/promoComponents/ProductPromoGrid";
import CategoryPromoGrid from "./components/promoComponents/CategoryPromoGrid";
import PromoConfigModal from "./components/promoComponents/PromoConfigModal";
import {
  PromoMetadata,
  PromoModalTarget,
  CategorySummary,
  PromoCalculationInput,
  loadStoredPromoMeta,
  saveStoredPromoMeta,
  inferPromoMeta,
  calculatePromoPrice,
  sendFoodPromoUpdate,
} from "./components/promoComponents/promoUtils";

export default function PromoPanel({ foods: initialFoods }: { foods: any[] }) {
  const {
    foods: storeFoods,
    isInitialized,
    updatePromo,
    refreshPanelData,
  } = useFoodStore();

  const foods = isInitialized
    ? storeFoods
    : storeFoods.length > 0
      ? storeFoods
      : initialFoods;

  const [promoMetaMap, setPromoMetaMap] = useState<Record<string, PromoMetadata>>({});
  const expiringIdsRef = useRef<Set<string>>(new Set());

  const [applicationTab, setApplicationTab] = useState<"products" | "categories">("products");
  const [modalTarget, setModalTarget] = useState<PromoModalTarget | null>(null);
  const [loading, setLoading] = useState(false);
  const [removingAll, setRemovingAll] = useState(false);
  const [removingCategory, setRemovingCategory] = useState<string | null>(null);

  useEffect(() => {
    setPromoMetaMap(loadStoredPromoMeta());
  }, []);

  const updateMetaForIds = useCallback(
    (ids: (string | number)[], meta: PromoMetadata | null) => {
      setPromoMetaMap((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          const key = String(id);
          if (meta === null) delete next[key];
          else next[key] = meta;
        }
        saveStoredPromoMeta(next);
        return next;
      });
    },
    []
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          foods
            .map((f) => (f.sub_category ? String(f.sub_category).trim() : ""))
            .filter(Boolean)
        )
      ),
    [foods]
  );

  const activePromos = useMemo(() => foods.filter((f) => f.is_promo), [foods]);

  const categorySummaries: CategorySummary[] = useMemo(() => {
    return categories.map((cat) => {
      const catFoods = foods.filter((f) => (f.sub_category || "").trim() === cat);
      const inPromoCount = catFoods.filter((f) => f.is_promo).length;
      const avgPrice =
        catFoods.length > 0
          ? Math.round(
              catFoods.reduce((acc, f) => acc + Number(f.price || 0), 0) / catFoods.length
            )
          : 0;
      return {
        name: cat,
        total: catFoods.length,
        inPromoCount,
        availableCount: catFoods.length - inPromoCount,
        avgPrice,
        samplePhotos: catFoods.map((f) => f.photo).filter(Boolean).slice(0, 3),
        foods: catFoods,
      };
    });
  }, [categories, foods]);

  const promoStats = useMemo(() => {
    if (activePromos.length === 0) {
      return { avgDiscount: 0, timedCount: 0, categoriesWithPromos: 0 };
    }
    const now = Date.now();
    let totalPct = 0;
    let timedCount = 0;
    const catSet = new Set<string>();

    for (const p of activePromos) {
      const meta = inferPromoMeta(p, promoMetaMap);
      totalPct += meta.percentOff || 0;
      if (meta.expiresAt && meta.expiresAt > now) timedCount += 1;
      if (p.sub_category) catSet.add(String(p.sub_category).trim());
    }

    return {
      avgDiscount: Math.round(totalPct / activePromos.length),
      timedCount,
      categoriesWithPromos: catSet.size,
    };
  }, [activePromos, promoMetaMap]);

  // Helper compartido para desactivar una o varias promociones
  const deactivatePromos = useCallback(
    async (targets: any[]) => {
      if (targets.length === 0) return false;
      const results = await Promise.all(
        targets.map(async (p) => {
          const ok = await sendFoodPromoUpdate(p._id, { is_promo: false, promo_price: 0 });
          if (ok) updatePromo(p._id, false, 0);
          return ok;
        })
      );
      if (results.some(Boolean)) {
        updateMetaForIds(
          targets.map((t) => t._id),
          null
        );
        await refreshPanelData();
        await refreshPage();
        return true;
      }
      return false;
    },
    [refreshPanelData, updateMetaForIds, updatePromo]
  );

  // Temporizador inteligente: programa un único timeout al próximo vencimiento (sin polling cada 1s)
  useEffect(() => {
    if (activePromos.length === 0) return;

    const now = Date.now();
    const expiredNow: any[] = [];
    let nextExpirationMs: number | null = null;

    for (const promo of activePromos) {
      const idStr = String(promo._id);
      if (expiringIdsRef.current.has(idStr)) continue;
      const meta = promoMetaMap[idStr];
      if (meta && typeof meta.expiresAt === "number") {
        if (meta.expiresAt <= now) {
          expiredNow.push(promo);
        } else if (nextExpirationMs === null || meta.expiresAt < nextExpirationMs) {
          nextExpirationMs = meta.expiresAt;
        }
      }
    }

    if (expiredNow.length > 0) {
      expiredNow.forEach((p) => expiringIdsRef.current.add(String(p._id)));
      void deactivatePromos(expiredNow).finally(() => {
        expiredNow.forEach((p) => expiringIdsRef.current.delete(String(p._id)));
      });
      return;
    }

    if (nextExpirationMs !== null) {
      const delay = Math.max(500, Math.min(nextExpirationMs - now + 200, 2147483647));
      const timer = setTimeout(() => {
        setPromoMetaMap((prev) => ({ ...prev }));
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [activePromos, deactivatePromos, promoMetaMap]);

  const handlePublish = useCallback(
    async ({
      foodsToUpdate,
      calcConfig,
      expiresAt,
      durationLabel,
      occasionTag,
      isCategory,
    }: {
      foodsToUpdate: any[];
      calcConfig: PromoCalculationInput;
      expiresAt: number | null;
      durationLabel: string;
      occasionTag: string;
      isCategory: boolean;
    }) => {
      if (foodsToUpdate.length === 0) return;
      setLoading(true);

      try {
        const startedAt = Date.now();
        const results = await Promise.all(
          foodsToUpdate.map(async (food) => {
            const { promoPrice, effectivePercent, badge } = calculatePromoPrice(
              Number(food.price || 0),
              calcConfig
            );
            const meta: PromoMetadata = {
              mode: calcConfig.mode,
              badge,
              percentOff: effectivePercent,
              buyQty: calcConfig.mode === "multiplier" ? calcConfig.buyQty : undefined,
              payQty: calcConfig.mode === "multiplier" ? calcConfig.payQty : undefined,
              secondUnitPercent:
                calcConfig.mode === "second_unit" ? calcConfig.secondUnitPercent : undefined,
              startedAt,
              expiresAt,
              durationLabel,
              occasionTag: occasionTag || undefined,
              categoryApplied: isCategory,
            };

            const ok = await sendFoodPromoUpdate(food._id, {
              is_promo: true,
              promo_price: promoPrice,
              promo_type: calcConfig.mode,
              promo_badge: badge,
              promo_expires_at: expiresAt,
              promo_started_at: startedAt,
              promo_buy_qty: calcConfig.mode === "multiplier" ? calcConfig.buyQty : null,
              promo_pay_qty: calcConfig.mode === "multiplier" ? calcConfig.payQty : null,
              promo_second_unit_percent:
                calcConfig.mode === "second_unit" ? calcConfig.secondUnitPercent : null,
              promo_occasion: occasionTag || null,
            });

            if (ok) {
              updatePromo(food._id, true, promoPrice, {
                promo_type: calcConfig.mode,
                promo_badge: badge,
                promo_expires_at: expiresAt,
              });
              updateMetaForIds([food._id], meta);
            }
            return ok;
          })
        );

        if (results.some(Boolean)) {
          await refreshPanelData();
          await refreshPage();
          setModalTarget(null);
        }
      } catch (error) {
        console.error("Error al publicar promoción:", error);
      } finally {
        setLoading(false);
      }
    },
    [refreshPanelData, updateMetaForIds, updatePromo]
  );

  const handleExtendPromoTime = useCallback(
    (foodId: string | number, hoursToAdd = 1) => {
      const food = foods.find((f) => String(f._id) === String(foodId));
      if (!food) return;
      const currentMeta = inferPromoMeta(food, promoMetaMap);
      const baseTime =
        currentMeta.expiresAt && currentMeta.expiresAt > Date.now()
          ? currentMeta.expiresAt
          : Date.now();
      updateMetaForIds([foodId], {
        ...currentMeta,
        expiresAt: baseTime + hoursToAdd * 3600 * 1000,
        durationLabel: `+${hoursToAdd}h`,
      });
    },
    [foods, promoMetaMap, updateMetaForIds]
  );

  const handleRemoveSingle = useCallback(
    async (id: string | number) => {
      try {
        await deactivatePromos([{ _id: id }]);
      } catch (error) {
        console.error("Error al quitar promo:", error);
      }
    },
    [deactivatePromos]
  );

  const handleRemoveByCategory = useCallback(
    async (catName: string) => {
      const targets = activePromos.filter((p) => (p.sub_category || "").trim() === catName);
      if (targets.length === 0) return;
      if (!window.confirm(`¿Quitar las ${targets.length} promociones activas de "${catName}"?`)) {
        return;
      }
      setRemovingCategory(catName);
      try {
        await deactivatePromos(targets);
      } catch (error) {
        console.error("Error al quitar promos de la categoría:", error);
      } finally {
        setRemovingCategory(null);
      }
    },
    [activePromos, deactivatePromos]
  );

  const handleRemoveAll = useCallback(async () => {
    if (!window.confirm("¿Quitar todas las promociones activas?")) return;
    setRemovingAll(true);
    try {
      await deactivatePromos(activePromos);
    } catch (error) {
      console.error("Error al quitar promos:", error);
    } finally {
      setRemovingAll(false);
    }
  }, [activePromos, deactivatePromos]);

  const handleSelectSingle = useCallback((food: any) => {
    setModalTarget({ type: "single", food });
  }, []);

  const handleSelectBatch = useCallback((selectedFoods: any[]) => {
    setModalTarget({ type: "batch", foods: selectedFoods });
  }, []);

  const handleConfigureCategory = useCallback(
    (categoryName: string) => {
      const catFoods = foods.filter((f) => (f.sub_category || "").trim() === categoryName);
      if (catFoods.length === 0) return;
      setModalTarget({ type: "category", categoryName, foods: catFoods });
    },
    [foods]
  );

  return (
    <div className="p-3 flex h-full w-full flex-col gap-6">
      <PromoStatsHeader
        activeCount={activePromos.length}
        avgDiscount={promoStats.avgDiscount}
        timedCount={promoStats.timedCount}
      />

      <ActivePromosSection
        activePromos={activePromos}
        allFoods={foods}
        categories={categories}
        categoriesWithPromos={promoStats.categoriesWithPromos}
        timedCount={promoStats.timedCount}
        promoMetaMap={promoMetaMap}
        removingAll={removingAll}
        removingCategory={removingCategory}
        onEditPromo={handleSelectSingle}
        onRemovePromo={handleRemoveSingle}
        onRemoveAll={handleRemoveAll}
        onRemoveByCategory={handleRemoveByCategory}
        onExtendTime={handleExtendPromoTime}
      />

      <div className="flex flex-col gap-4 border-t border-gray-200 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-800">Aplicar Nueva Promoción</h3>

          <div className="grid grid-cols-2 sm:inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full sm:w-auto gap-1">
            <button
              type="button"
              onClick={() => setApplicationTab("products")}
              className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-all whitespace-nowrap ${
                applicationTab === "products"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <FaTags size={12} className="shrink-0" />
              <span>Por Producto</span>
            </button>
            <button
              type="button"
              onClick={() => setApplicationTab("categories")}
              className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-all whitespace-nowrap ${
                applicationTab === "categories"
                  ? "bg-green-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaLayerGroup size={12} className="shrink-0" />
              <span>Por Categoría</span>
            </button>
          </div>
        </div>

        {applicationTab === "products" ? (
          <ProductPromoGrid
            foods={foods}
            categories={categories}
            onSelectSingle={handleSelectSingle}
            onSelectBatch={handleSelectBatch}
          />
        ) : (
          <CategoryPromoGrid
            categorySummaries={categorySummaries}
            removingCategory={removingCategory}
            onConfigureCategory={handleConfigureCategory}
            onRemoveCategoryPromos={handleRemoveByCategory}
          />
        )}
      </div>

      <PromoConfigModal
        target={modalTarget}
        promoMetaMap={promoMetaMap}
        loading={loading}
        onClose={() => setModalTarget(null)}
        onPublish={handlePublish}
      />
    </div>
  );
}
