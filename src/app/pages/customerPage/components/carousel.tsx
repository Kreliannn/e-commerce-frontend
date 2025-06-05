"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export function CarouselImage( { images, setIndex } : { images : string[], setIndex : React.Dispatch<React.SetStateAction<number>> }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const handleSelect = () => {
      const index = api.selectedScrollSnap()
      setCurrent(index + 1)
      console.log("Current carousel index:", index)
      setIndex(index)
    }

    api.on("select", handleSelect)

    // Cleanup on unmount
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  return (
    <div className="mx-auto max-w-xs m-auto">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index} className="p-0">
              <div className="h-96 w-full">
                <img
                  src={item}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
