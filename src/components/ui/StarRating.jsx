import { IconStar, IconStarFilled } from "@tabler/icons-react";

// eslint-disable-next-line react/prop-types
const StarRating = ({ rating, totalStars = 5 }) => {
  const stars = Array.from({ length: totalStars }, (_, index) => {
    const filled = index < rating;
    return filled ? (
      <IconStarFilled size={15} key={index} className="text-yellow-600" />
    ) : (
      <IconStar size={15} key={index} className="text-gray-300" />
    );
  });

  return <div className="flex">{stars}</div>;
};

export default StarRating;
