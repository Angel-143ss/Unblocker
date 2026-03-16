import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Heart, Share2, User, ImagePlus, X, Target, ChevronDown } from 'lucide-react';
import { useAppContext, ChallengeData, Language } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { translations } from '../lib/i18n';

interface Post {
  id: number;
  author: string;
  avatar: string;
  discipline: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  challenge?: ChallengeData;
}

const getInitialMockPosts = (lang: Language): Post[] => [
  {
    id: 1,
    author: 'Elena R.',
    avatar: 'ER',
    discipline: 'Writing',
    content: lang === 'es' ? 'Hoy logré escribir 1000 palabras después de 2 semanas de bloqueo. El ejercicio de "Escritura Automática" realmente me ayudó a apagar mi editor interno.' : 'Today I managed to write 1000 words after 2 weeks of block. The "Automatic Writing" exercise really helped me turn off my internal editor.',
    likes: 24,
    comments: 5,
    time: lang === 'es' ? 'hace 2 horas' : '2 hours ago',
  },
  {
    id: 2,
    author: 'Marcos T.',
    avatar: 'MT',
    discipline: 'Drawing',
    content: lang === 'es' ? 'Intenté dibujar con mi mano no dominante y el resultado fue un desastre hermoso. Me dio una nueva perspectiva sobre las formas imperfectas.' : 'I tried drawing with my non-dominant hand and the result was a beautiful disaster. It gave me a new perspective on imperfect shapes.',
    image: 'https://picsum.photos/seed/drawing/800/600',
    likes: 42,
    comments: 12,
    time: lang === 'es' ? 'hace 5 horas' : '5 hours ago',
  },
  {
    id: 3,
    author: 'Sofía L.',
    avatar: 'SL',
    discipline: 'Music',
    content: lang === 'es' ? '¿Alguien más siente que la inspiración solo llega a las 3 AM? Estoy buscando técnicas para entrar en "la zona" durante el día.' : 'Does anyone else feel like inspiration only hits at 3 AM? I\'m looking for techniques to get into "the zone" during the day.',
    likes: 89,
    comments: 34,
    time: lang === 'es' ? 'hace 1 día' : '1 day ago',
  },
];

export function Community() {
  const { discipline, language } = useAppContext();
  const t = translations[language];
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>(getInitialMockPosts(language));
  const [activeTab, setActiveTab] = useState<'all' | 'discipline'>('all');
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [attachedChallenge, setAttachedChallenge] = useState<ChallengeData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.state?.prefill) {
      setNewPost(location.state.prefill);
    }
    if (location.state?.challenge) {
      setAttachedChallenge(location.state.challenge);
    }
    if (location.state?.prefill || location.state?.challenge) {
      // Clear the state so it doesn't prefill again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(p => p.discipline === discipline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mt-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">{t.communityTitle}</h1>
        <p className="text-stone-600 dark:text-stone-400">
          {t.communitySubtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
            {t.you}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={t.shareUpdate}
              className="w-full h-24 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30 outline-none resize-none transition-all mb-3 text-stone-800 dark:text-stone-100"
            />
            
            {selectedImage && (
              <div className="relative inline-block mb-4">
                <img src={selectedImage} alt="Preview" className="h-32 rounded-lg object-cover border border-stone-200 dark:border-stone-700" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-stone-800 text-white rounded-full p-1 hover:bg-stone-900 transition-colors shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {attachedChallenge && (
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Target className="w-4 h-4" />
                    {t.attachedChallenge}
                  </div>
                  <p className="text-stone-800 dark:text-stone-200 text-sm font-medium">{attachedChallenge.title}</p>
                </div>
                <button
                  onClick={() => setAttachedChallenge(null)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-stone-500 hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
                  title={t.attachImage}
                >
                  <ImagePlus className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <button
                disabled={!newPost.trim() && !selectedImage && !attachedChallenge}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                onClick={() => {
                  const newPostObj: Post = {
                    id: Date.now(),
                    author: t.you,
                    avatar: t.you,
                    discipline: discipline,
                    content: newPost,
                    image: selectedImage || undefined,
                    challenge: attachedChallenge || undefined,
                    likes: 0,
                    comments: 0,
                    time: t.justNow,
                  };
                  setPosts([newPostObj, ...posts]);
                  setNewPost('');
                  setSelectedImage(null);
                  setAttachedChallenge(null);
                }}
              >
                {t.post}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 font-medium transition-colors relative ${activeTab === 'all' ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'}`}
        >
          {t.allArtists}
          {activeTab === 'all' && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('discipline')}
          className={`pb-2 font-medium transition-colors relative ${activeTab === 'discipline' ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'}`}
        >
          {t.onlyDiscipline} {discipline}
          {activeTab === 'discipline' && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 font-bold">
                {post.avatar}
              </div>
              <div>
                <h3 className="font-bold text-stone-800 dark:text-stone-100">{post.author}</h3>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span>{post.time}</span>
                  <span>•</span>
                  <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">{post.discipline}</span>
                </div>
              </div>
            </div>
            
            <p className="text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">
              {post.content}
            </p>

            {post.image && (
              <img 
                src={post.image} 
                alt="Post attachment" 
                className="w-full max-h-96 object-cover rounded-xl mb-4 border border-stone-100 dark:border-stone-800" 
                referrerPolicy="no-referrer"
              />
            )}

            {post.challenge && (
              <details className="mb-4 group bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                <summary className="cursor-pointer p-4 font-medium text-stone-800 dark:text-stone-200 flex items-center justify-between select-none hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-500" />
                    <span>{t.challengePrefix} {post.challenge.title}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-4 pt-0 border-t border-stone-200 dark:border-stone-700 mt-2">
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                    {post.challenge.type === 'visual' ? t.visualChallenge : t.conceptualChallenge}
                    {post.challenge.time && (
                      <>
                        <span className="text-stone-300 dark:text-stone-600">•</span>
                        <span className="text-stone-500 dark:text-stone-400">{post.challenge.time}</span>
                      </>
                    )}
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 text-sm mb-4">{post.challenge.description}</p>
                  
                  {post.challenge.steps && post.challenge.steps.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2">{t.steps}</h4>
                      <ul className="space-y-2">
                        {post.challenge.steps.map((step: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-sm text-stone-600 dark:text-stone-400">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {post.challenge.imageUrl && (
                    <img src={post.challenge.imageUrl} alt={t.challengeReference} className="w-full max-w-sm rounded-lg border border-stone-200 dark:border-stone-700 mt-4" />
                  )}
                </div>
              </details>
            )}
            
            <div className="flex items-center gap-6 border-t border-stone-100 dark:border-stone-800 pt-4">
              <button className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400">{t.noPostsYet}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
