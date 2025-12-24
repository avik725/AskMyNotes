import { useState, useEffect } from "react";
import Slider from "react-slick";

export default function Carousel({
  dots = true,
  infinite = true,
  speed = 500,
  slidesToShow: defaultSlidesToShow = 4,
  slidesToScroll = 4,
  initialSlide = 0,
  centerMode = false,
  lazyLoad = false,
  autoplay = false,
  autoplaySpeed = 2000,
  pauseOnHover = true,
  cssEase = "linear",
  swipeToSlide = true,
  children,
}) {
  // Calculate initial slidesToShow based on window width
  const getInitialSlidesToShow = () => {
    if (typeof window === "undefined") return defaultSlidesToShow;

    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 800) return 2;
    if (width <= 1024) return 3;
    return defaultSlidesToShow;
  };

  const [slidesToShow, setSlidesToShow] = useState(getInitialSlidesToShow);

  useEffect(() => {
    // Update slidesToShow on window resize
    const handleResize = () => {
      setSlidesToShow(getInitialSlidesToShow());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [defaultSlidesToShow]);

  return (
    <Slider
      dots={dots}
      infinite={infinite}
      speed={speed}
      slidesToShow={slidesToShow}
      slidesToScroll={slidesToScroll}
      initialSlide={initialSlide}
      centerMode={centerMode}
      lazyLoad={lazyLoad}
      autoplay={autoplay}
      autoplaySpeed={autoplaySpeed}
      pauseOnHover={pauseOnHover}
      cssEase={cssEase}
      swipeToSlide={swipeToSlide}
      responsive={[
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ]}
    >
      {children}
    </Slider>
  );
}
