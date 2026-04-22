import { useState, useEffect, useRef } from "react"
import PromoDayCard from '@/src/components/PromoDay'

function Carousel({ foods, template }: { foods: any[]; template: any }) {
    const slides = foods.filter((f) => f.is_promo)
    const [current, setCurrent] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

    useEffect(() => {
        if (slides.length <= 1) return;
        autoPlayRef.current = setInterval(nextSlide, 5000)
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current)
        }
    }, [current, slides.length])

    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) nextSlide()
        if (isRightSwipe) prevSlide()
    }

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
                {slides.map((slide, index) => (
                    <div key={index} className={`min-w-full shrink-0 px-1`}>
                        <PromoDayCard foods={slide} template={template} />
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <div className="flex items-center h-4 gap-1 mt-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === current
                                ? `${template?.accentColors?.[0] || "primary"} w-8 h-2.5`
                                : `${template?.backgroundColor2 || "bg-gray-300"} w-2`
                                }`}
                            aria-label={`Ir al slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default Carousel;