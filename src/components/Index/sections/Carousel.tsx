import { useState, useEffect } from "react"
import PromoDayCard from '@/src/components/PromoDay'

function Carousel({ foods }: { foods: any[] }) {
    const slides = foods.filter((f) => f.is_promo)
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [slides.length])

    return (
        <section className="flex flex-col items-center w-full h-auto overflow-hidden">

            <div className="flex w-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div key={index} className="min-w-full shrink-0 h-full relative border-2 border-transparent">
                        <PromoDayCard foods={slide} />
                    </div>
                ))}
            </div>

            {slides.length > 1 && <div className="flex gap-2 mt-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === current ? `bg-gray-900 w-6` : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>}
        </section>
    )
}

export default Carousel