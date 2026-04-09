"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import TestimonialCard from "./TestimonialCard";

import "swiper/css";
import "swiper/css/pagination";
import { testimonials } from "./testimonials";

export default function TestimonialsSection() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials.length) return null;

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-cyan-100">
      <div className="mx-auto mb-10 max-w-3xl px-4 text-center md:mb-14">
        <span className="inline-block rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
          Testimonials
        </span>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.8rem]">
          What Our Travelers Say
        </h2>

        <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
          Real experiences from our premium travelers across the world. Every
          journey is crafted with precision, comfort, and unforgettable moments.
        </p>
      </div>

      <div className="relative mx-auto bg-transparent max-w-7xl px-4 md:px-6 xl:px-8">
        <div className=" overflow-visible bg-transparent ">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={0}
            speed={1000}
            loop={testimonials.length > 1}
            autoHeight={false}
            grabCursor={true}
            centeredSlides={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setActiveIndex(swiper.realIndex);
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: ".testimonial-swiper-pagination",
              bulletClass: "testimonial-bullet",
              bulletActiveClass: "testimonial-bullet-active",
              renderBullet: function (_, className) {
                return `<span class="${className}"></span>`;
              },
            }}
            className="w-full overflow-hidden bg-transparent"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={item.id} className="h-auto!">
                <div className="mx-auto h-full max-w-300 xl:max-w-7xl bg-transparent">
                  <TestimonialCard
                    item={item}
                    isActive={activeIndex === index}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {testimonials.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-800 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-md transition duration-300 hover:scale-105 lg:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-800 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-md transition duration-300 hover:scale-105 lg:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {testimonials.length > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="testimonial-swiper-pagination static! flex! w-auto! items-center gap-2" />
        </div>
      )}
    </section>
  );
}
