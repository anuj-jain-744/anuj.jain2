interface CarouselItem {
  title: string;
  body: string;
  image_url: string;
  image_alt: string;
}

export interface CustomCarouselProps {
  title: string;
  carouselItems: CarouselItem[];
}