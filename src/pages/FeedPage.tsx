import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { FeedPostCard } from '../components/FeedPostCard';
import { JamCard } from '../components/JamCard';
import { BandRow } from '../components/BandRow';
import { ShowCard } from '../components/ShowCard';
import { CreatePostModal } from '../components/CreatePostModal';
import type { UnifiedFeedItem } from '../types';
import './FeedPage.css';

function assertNever(x: never): never {
  throw new Error('Unhandled feed item type: ' + String(x));
}

export function FeedPage() {
  const { feedPosts, jamPosts, bands, shows } = useApp();
  const [postModalOpen, setPostModalOpen] = useState(false);

  const feed = useMemo((): UnifiedFeedItem[] => {
    const items: UnifiedFeedItem[] = [
      ...feedPosts.map((p) => ({ type: 'post' as const, createdAt: p.createdAt, data: p })),
      ...jamPosts.map((j) => ({ type: 'jam' as const, createdAt: j.createdAt, data: j })),
      ...bands.map((b) => ({ type: 'band' as const, createdAt: b.createdAt, data: b })),
      ...shows.map((s) => ({ type: 'show' as const, createdAt: s.createdAt, data: s })),
    ];
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [feedPosts, jamPosts, bands, shows]);

  return (
    <div className="page">
      <div className="feed-page__composer">
        <button className="feed-page__compose-btn" onClick={() => setPostModalOpen(true)}>
          <span className="feed-page__compose-placeholder">What's happening in the scene?</span>
          <span className="btn btn--sm">Post</span>
        </button>
      </div>

      {feed.length === 0 ? (
        <div className="empty-state">The feed is empty. Be the first to post!</div>
      ) : (
        <div className="feed-page__list">
          {feed.map((item) => {
            switch (item.type) {
              case 'post':
                return <FeedPostCard key={item.data.id} post={item.data} />;
              case 'jam':
                return (
                  <div key={item.data.id} className="feed-page__jam-wrapper">
                    <JamCard jam={item.data} />
                  </div>
                );
              case 'band':
                return <BandRow key={item.data.id} band={item.data} />;
              case 'show':
                return (
                  <div key={item.data.id} className="feed-page__show-wrapper">
                    <ShowCard show={item.data} />
                  </div>
                );
              default:
                return assertNever(item);
            }
          })}
        </div>
      )}

      {postModalOpen && <CreatePostModal onClose={() => setPostModalOpen(false)} />}
    </div>
  );
}
