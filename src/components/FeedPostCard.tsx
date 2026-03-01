import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { timeAgo } from '../utils/dateUtils';
import { getEmbedUrl } from '../utils/videoUtils';
import type { FeedPost } from '../types';
import './FeedPostCard.css';

interface FeedPostCardProps {
  post: FeedPost;
}

export function FeedPostCard({ post }: FeedPostCardProps) {
  const { getUserById } = useAuth();
  const author = getUserById(post.authorId);
  const embedUrl = post.videoUrl ? getEmbedUrl(post.videoUrl) : null;

  return (
    <article className="feed-post-card panel">
      <div className="feed-post-card__header">
        <span className="tag tag--post">Post</span>
        <div className="feed-post-card__author">
          {author ? (
            <>
              <UserAvatar user={author} size="sm" />
              <Link to={`/profile/${author.username}`} className="feed-post-card__username">
                {author.username}
              </Link>
            </>
          ) : (
            <span className="feed-post-card__username">unknown</span>
          )}
          <span className="feed-post-card__time">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      <p className="feed-post-card__content">{post.content}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post image" className="feed-post-card__image" />
      )}

      {embedUrl && (
        <div className="feed-post-card__video">
          <iframe
            src={embedUrl}
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </article>
  );
}
