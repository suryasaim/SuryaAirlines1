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

  const imageItems = [
    {
      imageUrl: 'https://www.shutterstock.com/image-photo/white-passenger-plane-fly-over-600nw-1915850917.jpg',
      size: { width: '100%', height: '100%' },
    },
    {
      imageUrl: 'https://pilotinstitute.com/wp-content/uploads/2023/02/How-Much-Do-Airplanes-Cost.jpg',
      size: { width: '100%', height: '100%' },
    },
    {
      imageUrl: 'https://www.cleartrip.com/offers/sites/default/files/styles/destination-top/public/_op_2392_x_1196_axis-air.png?itok=C7KwAMs1',
      size: { width: '100%', height: '100%' },
    },
    {
      imageUrl: 'https://www.yatra.com/ythomepagecms/media/imagemanager/2019/Dec/81f8c45e11fc69990887380531d8170b.jpg',
      size: { width: '100%', height: '100%' },
    },
    // {
    //   imageUrl: 'https://offercdn.paytm.com/blog/2021/12/welcomeflight-tnc-app.png',
    //   size: { width: '100%', height: '100%' },
    // },
  ];

  return (
    <div className="slider-container" style={{ height: '90vh', overflow: 'hidden' }}>
      <Slider {...settings}>
        {imageItems.map((imageItem, index) => (
          <div key={index}>
            <img
              src={imageItem.imageUrl}
              alt={`Slide ${index + 1}`}
              style={imageItem.size}
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
