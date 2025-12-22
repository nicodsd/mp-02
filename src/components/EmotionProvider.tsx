"use client";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "@/app/emotion";
const cache = createEmotionCache();
export default function EmotionProvider({ children }: { children: React.ReactNode }) {
    return <CacheProvider value={cache}>{children}</CacheProvider>;
}