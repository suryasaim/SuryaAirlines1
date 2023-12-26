import React from 'react';
import Slider from 'react-slick';

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const imageUrls = [
    'https://www.shutterstock.com/image-photo/white-passenger-plane-fly-over-600nw-1915850917.jpg',
    'https://pilotinstitute.com/wp-content/uploads/2023/02/How-Much-Do-Airplanes-Cost.jpg',
    'https://www.cleartrip.com/offers/sites/default/files/styles/destination-top/public/_op_2392_x_1196_axis-air.png?itok=C7KwAMs1',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSay2ESu0BaSBmJwx1oxuITJecusaZA5SGBXA&usqp=CAU',
  ];

  return (
    <div className="slider-container" style={{ height: '70vh', overflow: 'hidden' }}>
      <Slider {...settings}>
        {imageUrls.map((imageUrl, index) => (
          <div key={index}>
            <img
              src={imageUrl}
              alt={`Slide ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Custom arrow component for the previous button
const CustomPrevArrow = (props) => (
    <div {...props} className="slick-prev" style={{ left: '10px', zIndex: 1 }}>
      {/* Your custom previous button content */}
      <i className="fas fa-chevron-left"></i> {/* Replace with your custom icon */}
    </div>
  );
  
  // Custom arrow component for the next button with a custom icon
  const CustomNextArrow = (props) => (
    <div {...props} className="slick-next" style={{ right: '10px', zIndex: 1 }}>
      {/* Your custom next button content */}
      <i className="fas fa-chevron-right"></i> {/* Replace with your custom icon */}
    </div>
  );

export default ImageSlider;
