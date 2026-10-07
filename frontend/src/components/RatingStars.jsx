import { FaStar, FaRegStar } from 'react-icons/fa';

export default function RatingStars({ rating = 0, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const Icon = i <= Math.round(rating) ? FaStar : FaRegStar;
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? 'star filled' : 'star'}>
        <Icon size={size} />
      </span>
    );
  }
  return <span className="stars">{stars}</span>;
}
