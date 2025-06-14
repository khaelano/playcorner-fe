import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import type { EmblaEventType } from "embla-carousel";

const CarouselIndicator = ({ emblaApi }: { emblaApi?: EmblaCarouselType }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [snapList, setSnapList] = useState<number[]>([]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setSnapList(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("init", onInit).on("reInit", onInit).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollIndicators = snapList.map((_, i) => {
    return (
      <button
        key={i}
        className={`${activeIndex === i ? "bg-primary-300 w-6" : "bg-primary-200 w-2"} h-2 rounded-full transition-all duration-150`}
      />
    );
  });
  return (
    <div className="flex flex-row space-x-2 justify-center">
      {scrollIndicators}
    </div>
  );
};

type CarouselProps = {
  children?: React.ReactNode;
};

export default function Carousel({ children }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, containScroll: false },
    [Autoplay()],
  );
  const tweenFactor = useRef<number>(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType) => {
    tweenNodes.current = emblaApi.slideNodes().map((slide) => {
      return slide.querySelector(".embla__slide__children") as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = 0.1 * emblaApi?.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScroll = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIdx) => {
        let diffToTarget = Math.abs(scrollSnap - scrollProgress);
        const slidesInSnap = engine.slideRegistry[snapIdx];

        slidesInSnap.forEach((slideIdx) => {
          if (isScroll && !slidesInView.includes(slideIdx)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIdx === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) {
                  diffToTarget = Math.abs(scrollSnap - (1 + scrollProgress));
                }
                if (sign === 1) {
                  diffToTarget = Math.abs(scrollSnap + (1 - scrollProgress));
                }
              }
            });
          }

          const tweenValue = 1 - tweenFactor.current * diffToTarget;
          const scale = Math.min(Math.max(tweenValue, 0), 1);
          const tweenNode = tweenNodes.current[slideIdx];
          tweenNode.style.transform = `scale(${scale})`;
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);
    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale)
      .on("select", tweenScale);
  }, [emblaApi, tweenScale, setTweenFactor, setTweenNodes]);

  const slides = React.Children.map(children, (child, i) => (
    <div key={i} className={`embla__slide`}>
      <div className="embla__slide__children">{child}</div>
    </div>
  ));

  return (
    <>
      <div className="embla flex flex-col space-y-4 justif-start">
        <div className={`embla__viewport py-2`} ref={emblaRef}>
          <div className="embla__container">{slides}</div>
        </div>
        <CarouselIndicator emblaApi={emblaApi} />
      </div>
      <style>
        {`
        .embla {
            /* max-width: 24rem; */
            margin: auto;
            --slide-spacing: 0px;
            --slide-size: 80%;
        }
        .embla__viewport {
            overflow: hidden;
        }
        .embla__container {
            display: flex;
            touch-action: pan-y pinch-zoom;
            margin-left: calc(var(--slide-spacing) * -1);
        }
        .embla__slide {
            transform: translate3d(0, 0, 0);
            flex: 0 0 var(--slide-size);
            min-width: 0;
            padding-left: var(--slide-spacing);
        }
        `}
      </style>
    </>
  );
}
