/* ============================================
   NEWS.JSX — Компонент управління публікаціями
   Функціонал:
   • Перегляд постів з фільтрацією за платформами
   • Модальне вікно редагування з розширеними налаштуваннями
   • Завантаження фото/відео (до 2 файлів) з превью
   • Валідація форми та доступність (a11y)
   ============================================ */

   import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
   import { createPortal } from 'react-dom';
   import './News.css';
   
   // ============================================
   // 📦 КОНСТАНТИ ТА КОНФІГУРАЦІЯ
   // ============================================
   
   /**
    * Конфігурація соціальних платформ
    * @type {Object}
    */
   const PLATFORMS = {
     all: {
       id: 'all',
       name: 'Всі мережі',
       icon: '🌐',
       color: '#8a5fe0',
       badgeColor: 'linear-gradient(135deg, #8a5fe0 0%, #6d44b8 100%)'
     },
     instagram: {
       id: 'instagram',
       name: 'Instagram',
       icon: '📸',
       color: '#E4405F',
       badgeColor: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
       // ⚙️ Специфічні налаштування платформи
       settings: {
         maxMediaFiles: 10,
         allowedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4'],
         maxFileSizeMB: 100,
         supportsStories: true,
         supportsReels: true
       }
     },
     facebook: {
       id: 'facebook',
       name: 'Facebook',
       icon: '📘',
       color: '#1877F2',
       badgeColor: 'linear-gradient(135deg, #1877F2 0%, #42B72A 100%)',
       settings: {
         maxMediaFiles: 5,
         allowedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'],
         maxFileSizeMB: 250,
         supportsStories: true,
         supportsReels: false
       }
     },
     tiktok: {
       id: 'tiktok',
       name: 'TikTok',
       icon: '🎵',
       color: '#000000',
       badgeColor: 'linear-gradient(135deg, #000000 0%, #69C9D0 100%)',
       settings: {
         maxMediaFiles: 1,
         allowedMediaTypes: ['video/mp4', 'video/quicktime'],
         maxFileSizeMB: 287,
         supportsStories: false,
         supportsReels: false,
         verticalVideoOnly: true
       }
     }
   };
   
   /**
    * Мокові дані постів для демонстрації
    * У реальному проекті — запит до API
    * @type {Array}
    */
   const MOCK_POSTS = [
     // Instagram пости
     { id: 1, platform: 'instagram', title: 'Новий продукт у каталозі', description: 'Презентували ексклюзивну колекцію весна-літо 2026.', author: 'Marketing Team', scheduledFor: '2026-03-15T14:00', status: 'scheduled', media: [], tags: ['весна2026', 'колекція'], audience: 'all' },
     { id: 4, platform: 'instagram', title: 'Stories: За лаштунками', description: 'Показали процес створення контенту для бренду.', author: 'Content Team', scheduledFor: '2026-03-16T10:00', status: 'draft', media: [], tags: ['behindthescenes'], audience: 'followers' },
     { id: 7, platform: 'instagram', title: 'Reels: Тренди весни', description: 'Відео-огляд модних тенденцій нового сезону.', author: 'Creative Team', scheduledFor: '2026-03-17T18:00', status: 'published', media: [], tags: ['reels', 'тренди'], audience: 'all' },
     { id: 10, platform: 'instagram', title: 'IGTV: Інтерв\'ю з засновником', description: 'Ексклюзивне інтерв\'ю про місію бренду та плани на майбутнє.', author: 'PR Team', scheduledFor: '2026-03-18T12:00', status: 'scheduled', media: [], tags: ['interview'], audience: 'all' },
     { id: 13, platform: 'instagram', title: 'Carousel: 5 способів стилізації', description: 'Гайд по комбінуванню базових речей з нової колекції.', author: 'Style Team', scheduledFor: '2026-03-19T15:30', status: 'draft', media: [], tags: ['carousel', 'style'], audience: 'all' },
     { id: 16, platform: 'instagram', title: 'Giveaway: Розіграш подарунків', description: 'Запустіли конкурс для підписників з цінними призами.', author: 'Community Team', scheduledFor: '2026-03-20T09:00', status: 'published', media: [], tags: ['giveaway', 'contest'], audience: 'all' },
     // Facebook пости
     { id: 2, platform: 'facebook', title: 'Анонс вебінару для клієнтів', description: 'Запрошуємо на безкоштовний вебінар з цифрового маркетингу.', author: 'Sales Team', scheduledFor: '2026-03-20T16:00', status: 'scheduled', media: [], tags: ['вебінар'], audience: 'all' },
     { id: 5, platform: 'facebook', title: 'Оновлення політики конфіденційності', description: 'Інформуємо про зміни у обробці персональних даних.', author: 'Legal Team', scheduledFor: '2026-03-18T09:00', status: 'draft', media: [], tags: ['privacy'], audience: 'all' },
     { id: 8, platform: 'facebook', title: 'Відгуки клієнтів: Історія успіху', description: 'Поділилися реальним кейсом співпраці з партнером.', author: 'PR Team', scheduledFor: '2026-03-19T12:00', status: 'published', media: [], tags: ['testimonial'], audience: 'all' },
     { id: 11, platform: 'facebook', title: 'Live-трансляція: Питання-відповіді', description: 'Пряма ефір з експертами компанії для відповідей на запитання.', author: 'Support Team', scheduledFor: '2026-03-21T18:00', status: 'scheduled', media: [], tags: ['live', 'Q&A'], audience: 'all' },
     { id: 14, platform: 'facebook', title: 'Стаття: Тренди індустрії 2026', description: 'Аналітичний огляд ключових тенденцій ринку цього року.', author: 'Analytics Team', scheduledFor: '2026-03-22T10:00', status: 'draft', media: [], tags: ['аналітика'], audience: 'all' },
     { id: 17, platform: 'facebook', title: 'Подія: Запрошення на конференцію', description: 'Реєстрація відкрита на щорічну галузеву конференцію.', author: 'Events Team', scheduledFor: '2026-03-23T14:00', status: 'published', media: [], tags: ['event'], audience: 'all' },
     // TikTok пости
     { id: 3, platform: 'tiktok', title: 'Челендж #BrandChallenge', description: 'Запустили вірусний челендж для залучення аудиторії.', author: 'Viral Team', scheduledFor: '2026-03-21T20:00', status: 'scheduled', media: [], tags: ['challenge'], audience: 'all' },
     { id: 6, platform: 'tiktok', title: 'Туторіал: Як використовувати продукт', description: 'Коротке відео-інструкція з використанням трендових звуків.', author: 'Education Team', scheduledFor: '2026-03-22T15:00', status: 'draft', media: [], tags: ['tutorial'], audience: 'all' },
     { id: 9, platform: 'tiktok', title: 'Behind the scenes: Офіс', description: 'Показали атмосферу в офісі та команду за роботою.', author: 'HR Team', scheduledFor: '2026-03-23T11:00', status: 'published', media: [], tags: ['office'], audience: 'all' },
     { id: 12, platform: 'tiktok', title: 'Duet з інфлюенсером', description: 'Спільне відео з популярним креатором для розширення охоплення.', author: 'Influencer Team', scheduledFor: '2026-03-24T19:00', status: 'scheduled', media: [], tags: ['duet', 'influencer'], audience: 'all' },
     { id: 15, platform: 'tiktok', title: 'Трендовий звук + наш продукт', description: 'Адаптували вірусний аудіо-тренд під потреби бренду.', author: 'Creative Team', scheduledFor: '2026-03-25T16:30', status: 'draft', media: [], tags: ['trending'], audience: 'all' },
     { id: 18, platform: 'tiktok', title: 'UGC-контент: Відео від користувачів', description: 'Зібрали найкращі відео від нашої спільноти в одному ролику.', author: 'Community Team', scheduledFor: '2026-03-26T13:00', status: 'published', media: [], tags: ['UGC'], audience: 'all' }
   ];
   
   // ============================================
   // 🎣 CUSTOM HOOK: useNewsPosts
   // Відповідає за логіку завантаження та фільтрації постів
   // ============================================
   
   /**
    * Хук для управління станом постів
    * @returns {Object} - стан та методи для роботи з постами
    */
   const useNewsPosts = () => {
     const [posts, setPosts] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [visibleCards, setVisibleCards] = useState([]);
     const [activePlatform, setActivePlatform] = useState('all');
   
     /**
      * Функція завантаження постів (імітація API запиту)
      */
     const fetchPosts = useCallback(async () => {
       try {
         setLoading(true);
         setError(null);
         // Імітація мережевої затримки
         await new Promise(resolve => setTimeout(resolve, 500));
         setPosts(MOCK_POSTS);
         setVisibleCards([]);
         // Анімація поступової появи карток
         MOCK_POSTS.forEach((_, index) => {
           setTimeout(() => {
             setVisibleCards(prev => [...prev, index]);
           }, index * 50);
         });
       } catch (err) {
         setError('Не вдалося завантажити пости. Спробуйте пізніше.');
         console.error('Posts fetch error:', err);
       } finally {
         setLoading(false);
       }
     }, []);
   
     // Початкове завантаження при монтуванні
     useEffect(() => {
       fetchPosts();
     }, [fetchPosts]);
   
     // Мемоізована фільтрація за платформою
     const filteredPosts = useMemo(() => {
       if (activePlatform === 'all') return posts;
       return posts.filter(post => post.platform === activePlatform);
     }, [posts, activePlatform]);
   
     // Анімація появи карток при зміні фільтра
     useEffect(() => {
       setVisibleCards([]);
       filteredPosts.forEach((_, index) => {
         setTimeout(() => {
           setVisibleCards(prev => [...prev, index]);
         }, index * 50);
       });
     }, [activePlatform, filteredPosts.length]);
   
     const handlePlatformChange = useCallback((platformId) => {
       setActivePlatform(platformId);
     }, []);
   
     return {
       posts,
       setPosts,
       loading,
       error,
       activePlatform,
       filteredPosts,
       visibleCards,
       handlePlatformChange,
       fetchPosts
     };
   };
   
   // ============================================
   // 🖼️ КОМПОНЕНТ: MediaUploadPreview
   // Відповідає за завантаження та превью медіафайлів (до 2 файлів)
   // ============================================
   
   const MediaUploadPreview = ({ platform, mediaFiles, onFilesChange, onRemoveFile }) => {
     const fileInputRef = useRef(null);
     const platformSettings = PLATFORMS[platform]?.settings;
     
     // 🔍 Обчислюємо доступні обмеження для поточної платформи
     const maxFiles = platformSettings?.maxMediaFiles || 2;
     const allowedTypes = platformSettings?.allowedMediaTypes || ['image/*', 'video/*'];
     const maxSizeBytes = (platformSettings?.maxFileSizeMB || 50) * 1024 * 1024;
     const remainingSlots = maxFiles - mediaFiles.length;
   
     /**
      * Обробка вибору файлів через input
      */
     const handleFileSelect = (e) => {
       const files = Array.from(e.target.files);
       const validFiles = [];
       
       files.forEach(file => {
         // ✅ Перевірка типу файлу
         if (!allowedTypes.some(type => 
           type.endsWith('/*') ? file.type.startsWith(type.split('/')[0]) : file.type === type
         )) {
           alert(`Файл "${file.name}" має недопустимий формат`);
           return;
         }
         // ✅ Перевірка розміру
         if (file.size > maxSizeBytes) {
           alert(`Файл "${file.name}" перевищує ліміт ${platformSettings.maxFileSizeMB}MB`);
           return;
         }
         validFiles.push(file);
       });
   
       // ✅ Додаємо файли, якщо є вільні слоти
       if (validFiles.length > 0 && remainingSlots > 0) {
         const filesToAdd = validFiles.slice(0, remainingSlots);
         onFilesChange([...mediaFiles, ...filesToAdd]);
       }
       
       // Скидаємо input для можливості повторного вибору того ж файлу
       e.target.value = '';
     };
   
     /**
      * Генерація URL для превью файлу
      */
     const getFilePreview = (file) => {
       if (file.type.startsWith('image/')) {
         return URL.createObjectURL(file);
       }
       if (file.type.startsWith('video/')) {
         return URL.createObjectURL(file);
       }
       return null;
     };
   
     /**
      * Форматування назви файлу для відображення
      */
     const formatFileName = (name, maxLength = 20) => {
       if (name.length <= maxLength) return name;
       const ext = name.split('.').pop();
       return `${name.slice(0, maxLength - ext.length - 3)}...${ext}`;
     };
   
     return (
       <div className="media-upload-section">
         <label className="form-label">
           Медіафайли 
           <span className="form-hint"> (до {maxFiles} файлів, макс. {platformSettings?.maxFileSizeMB}MB кожен)</span>
         </label>
         
         {/* 📁 Область завантаження файлів */}
         <div 
           className={`media-dropzone ${remainingSlots <= 0 ? 'disabled' : ''}`}
           onClick={() => remainingSlots > 0 && fileInputRef.current?.click()}
           role="button"
           tabIndex={remainingSlots > 0 ? 0 : -1}
           aria-disabled={remainingSlots <= 0}
           onKeyDown={(e) => {
             if (e.key === 'Enter' || e.key === ' ') {
               e.preventDefault();
               if (remainingSlots > 0) fileInputRef.current?.click();
             }
           }}
         >
           <input
             ref={fileInputRef}
             type="file"
             multiple
             accept={allowedTypes.join(',')}
             onChange={handleFileSelect}
             className="media-input-hidden"
             aria-label="Завантажити медіафайли"
           />
           
           {remainingSlots > 0 ? (
             <>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropzone-icon" aria-hidden="true">
                 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                 <polyline points="17 8 12 3 7 8"></polyline>
                 <line x1="12" y1="3" x2="12" y2="15"></line>
               </svg>
               <span className="dropzone-text">
                 Натисніть або перетягніть файли сюди
               </span>
               <span className="dropzone-subtext">
                 {allowedTypes.map(t => t.replace('*','')).join(', ').toUpperCase()}
               </span>
             </>
           ) : (
             <span className="dropzone-full">✅ Досягнуто ліміт файлів ({maxFiles})</span>
           )}
         </div>
   
         {/* 🖼️ Превью завантажених файлів (показуємо максимум 2, як просили) */}
         {mediaFiles.length > 0 && (
           <div className="media-preview-grid">
             {mediaFiles.slice(0, 2).map((file, index) => {
               const previewUrl = getFilePreview(file);
               const isVideo = file.type.startsWith('video/');
               
               return (
                 <div key={index} className="media-preview-item">
                   {/* Превью зображення або відео */}
                   {isVideo ? (
                     <video src={previewUrl} className="media-preview-media" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                   ) : (
                     <img src={previewUrl} alt={file.name} className="media-preview-media" />
                   )}
                   
                   {/* Інформація про файл */}
                   <div className="media-preview-info">
                     <span className="media-preview-name" title={file.name}>
                       {formatFileName(file.name)}
                     </span>
                     <span className="media-preview-size">
                       {(file.size / 1024 / 1024).toFixed(1)} MB
                     </span>
                   </div>
                   
                   {/* Кнопка видалення */}
                   <button 
                     type="button"
                     className="media-preview-remove"
                     onClick={(e) => { e.stopPropagation(); onRemoveFile(index); }}
                     aria-label={`Видалити файл ${file.name}`}
                   >
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                       <line x1="18" y1="6" x2="6" y2="18"></line>
                       <line x1="6" y1="6" x2="18" y2="18"></line>
                     </svg>
                   </button>
                   
                   {/* Бейдж порядку файлу */}
                   <span className="media-preview-order">{index + 1}</span>
                 </div>
               );
             })}
             
             {/* Індикатор, якщо файлів більше 2 */}
             {mediaFiles.length > 2 && (
               <div className="media-preview-more">
                 +{mediaFiles.length - 2} ще
               </div>
             )}
           </div>
         )}
       </div>
     );
   };
   
   // ============================================
   // 🪟 МОДАЛЬНЕ ВІКНО: EditPostModal
   // Повне модальне вікно з розширеними налаштуваннями
   // ============================================
   
   const EditPostModal = ({ post, platform, onClose, onSave }) => {
     const modalRef = useRef(null);
     const firstInputRef = useRef(null);
     
     // 📝 Стан форми з усіма полями налаштувань
     const [formData, setFormData] = useState({
       title: post?.title || '',
       description: post?.description || '',
       scheduledFor: post?.scheduledFor || '',
       status: post?.status || 'draft',
       tags: post?.tags?.join(', ') || '',
       audience: post?.audience || 'all',
       media: post?.media || [] // Масив об'єктів File
     });
     
     const [errors, setErrors] = useState({});
     const [activeSettingsTab, setActiveSettingsTab] = useState('content');
   
     // 🔍 Фокус на першому полі при відкритті модалки
     useEffect(() => {
       if (firstInputRef.current) {
         firstInputRef.current.focus();
       }
     }, []);
   
     // ⌨️ Обробка клавіш: ESC для закриття, Trap focus для доступності
     useEffect(() => {
       const handleKeyDown = (e) => {
         if (e.key === 'Escape') {
           e.preventDefault();
           onClose();
         }
         // Trap focus within modal для a11y
         if (e.key === 'Tab' && modalRef.current) {
           const focusableElements = modalRef.current.querySelectorAll(
             'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
           );
           const firstElement = focusableElements[0];
           const lastElement = focusableElements[focusableElements.length - 1];
           
           if (e.shiftKey && document.activeElement === firstElement) {
             e.preventDefault();
             lastElement.focus();
           } else if (!e.shiftKey && document.activeElement === lastElement) {
             e.preventDefault();
             firstElement.focus();
           }
         }
       };
   
       document.addEventListener('keydown', handleKeyDown);
       document.body.style.overflow = 'hidden'; // Заборона скролу фону
       
       return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.body.style.overflow = 'unset';
       };
     }, [onClose]);
   
     // ✅ Валідація обов'язкових полів
     const validate = () => {
       const newErrors = {};
       if (!formData.title.trim()) newErrors.title = "Заголовок обов'язковий";
       if (!formData.description.trim()) newErrors.description = "Опис обов'язковий";
       if (!formData.scheduledFor) newErrors.scheduledFor = "Оберіть дату публікації";
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
     };
   
     // 🔄 Обробник зміни полів форми
     const handleChange = (field) => (e) => {
       setFormData(prev => ({ ...prev, [field]: e.target.value }));
       if (errors[field]) {
         setErrors(prev => ({ ...prev, [field]: null }));
       }
     };
   
     // 📤 Обробник завантаження медіафайлів
     const handleMediaFilesChange = (files) => {
       setFormData(prev => ({ ...prev, media: files }));
     };
   
     // 🗑️ Обробник видалення медіафайлу
     const handleRemoveMediaFile = (index) => {
       setFormData(prev => ({
         ...prev,
         media: prev.media.filter((_, i) => i !== index)
       }));
     };
   
     // 💾 Обробник відправки форми
     const handleSubmit = (e) => {
       e.preventDefault();
       if (validate()) {
         // 🔄 Конвертуємо теги з рядка в масив
         const tagsArray = formData.tags
           .split(',')
           .map(tag => tag.trim())
           .filter(tag => tag.length > 0);
         
         onSave({ 
           ...post, 
           ...formData, 
           tags: tagsArray 
         });
         onClose();
       }
     };
   
     // 📋 Опції статусів публікації
     const statusOptions = [
       { value: 'draft', label: 'Чернетка', color: '#6c757d' },
       { value: 'scheduled', label: 'Заплановано', color: '#ffc107' },
       { value: 'published', label: 'Опубліковано', color: '#28a745' }
     ];
   
     // 👥 Опції аудиторії
     const audienceOptions = [
       { value: 'all', label: 'Всім підписникам' },
       { value: 'followers', label: 'Тільки активним підписникам' },
       { value: 'custom', label: 'Обрана аудиторія' }
     ];
   
     // 🕐 Форматування дати для input datetime-local
     const formatDateTimeLocal = (dateStr) => {
       if (!dateStr) return '';
       const date = new Date(dateStr);
       return date.toISOString().slice(0, 16);
     };
   
     // 🎛️ Вкладки налаштувань
     const settingsTabs = [
       { id: 'content', label: 'Контент', icon: '📝' },
       { id: 'media', label: 'Медіа', icon: '🖼️' },
       { id: 'schedule', label: 'Публікація', icon: '📅' },
       { id: 'advanced', label: 'Додатково', icon: '⚙️' }
     ];
   
     return createPortal(
       <div 
         className="modal-overlay" 
         onClick={onClose}
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title"
       >
         <div 
           className="modal-content modal-content-large" 
           ref={modalRef}
           onClick={(e) => e.stopPropagation()}
         >
           {/* 🔝 Header модалки */}
           <div className="modal-header">
             <div className="modal-header-left">
               <h2 id="modal-title" className="modal-title">
                 Редагувати публікацію
               </h2>
               <div className="modal-platform-badge" style={{ background: platform?.badgeColor }}>
                 <span aria-hidden="true">{platform?.icon}</span>
                 {platform?.name}
               </div>
             </div>
             <button 
               className="modal-close" 
               onClick={onClose}
               aria-label="Закрити модальне вікно"
             >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                 <line x1="18" y1="6" x2="6" y2="18"></line>
                 <line x1="6" y1="6" x2="18" y2="18"></line>
               </svg>
             </button>
           </div>
   
           {/* 📑 Tabs навігації по налаштуваннях */}
           <div className="modal-tabs">
             {settingsTabs.map(tab => (
               <button
                 key={tab.id}
                 className={`modal-tab-btn ${activeSettingsTab === tab.id ? 'active' : ''}`}
                 onClick={() => setActiveSettingsTab(tab.id)}
                 role="tab"
                 aria-selected={activeSettingsTab === tab.id}
                 aria-controls={`panel-${tab.id}`}
               >
                 <span aria-hidden="true">{tab.icon}</span>
                 {tab.label}
               </button>
             ))}
           </div>
   
           {/* 📄 Form контенту */}
           <form onSubmit={handleSubmit} className="modal-form">
             
             {/* 📝 Вкладка: Контент */}
             {activeSettingsTab === 'content' && (
               <div id="panel-content" role="tabpanel" aria-labelledby="tab-content">
                 <div className="form-group">
                   <label htmlFor="post-title" className="form-label">
                     Заголовок <span className="required">*</span>
                   </label>
                   <input
                     ref={firstInputRef}
                     id="post-title"
                     type="text"
                     className={`form-input ${errors.title ? 'error' : ''}`}
                     value={formData.title}
                     onChange={handleChange('title')}
                     placeholder="Введіть заголовок публікації"
                     aria-required="true"
                     aria-invalid={!!errors.title}
                   />
                   {errors.title && <span className="form-error" role="alert">{errors.title}</span>}
                 </div>
   
                 <div className="form-group">
                   <label htmlFor="post-description" className="form-label">
                     Опис <span className="required">*</span>
                   </label>
                   <textarea
                     id="post-description"
                     className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                     value={formData.description}
                     onChange={handleChange('description')}
                     placeholder="Опишіть зміст публікації"
                     rows={4}
                     aria-required="true"
                     aria-invalid={!!errors.description}
                   />
                   {errors.description && <span className="form-error" role="alert">{errors.description}</span>}
                 </div>
   
                 <div className="form-group">
                   <label htmlFor="post-tags" className="form-label">Теги</label>
                   <input
                     id="post-tags"
                     type="text"
                     className="form-input"
                     value={formData.tags}
                     onChange={handleChange('tags')}
                     placeholder="тег1, тег2, тег3 (через кому)"
                   />
                   <span className="form-hint">Теги допоможуть у пошуку та аналітиці</span>
                 </div>
               </div>
             )}
   
             {/* 🖼️ Вкладка: Медіа */}
             {activeSettingsTab === 'media' && (
               <div id="panel-media" role="tabpanel" aria-labelledby="tab-media">
                 <MediaUploadPreview
                   platform={platform?.id}
                   mediaFiles={formData.media}
                   onFilesChange={handleMediaFilesChange}
                   onRemoveFile={handleRemoveMediaFile}
                 />
                 
                 {/* 💡 Підказки для платформи */}
                 <div className="platform-tips">
                   <h4>Рекомендації для {platform?.name}:</h4>
                   <ul>
                     {platform?.id === 'instagram' && (
                       <>
                         <li>📐 Оптимальне співвідношення: 1:1 (квадрат) або 4:5</li>
                         <li>🎬 Reels: вертикальне відео 9:16, до 90 секунд</li>
                         <li>🖼️ Stories: 9:16, до 15 секунд на слайд</li>
                       </>
                     )}
                     {platform?.id === 'facebook' && (
                       <>
                         <li>📐 Рекомендовано: 1200x630px для посилань</li>
                         <li>🎥 Відео: до 240 хвилин, MP4 формат</li>
                       </>
                     )}
                     {platform?.id === 'tiktok' && (
                       <>
                         <li>📱 Тільки вертикальне відео 9:16</li>
                         <li>⏱️ Оптимальна тривалість: 15-60 секунд</li>
                         <li>🎵 Використовуйте трендові звуки для більшого охоплення</li>
                       </>
                     )}
                   </ul>
                 </div>
               </div>
             )}
   
             {/* 📅 Вкладка: Публікація */}
             {activeSettingsTab === 'schedule' && (
               <div id="panel-schedule" role="tabpanel" aria-labelledby="tab-schedule">
                 <div className="form-row">
                   <div className="form-group form-group-half">
                     <label htmlFor="post-date" className="form-label">
                       Дата та час <span className="required">*</span>
                     </label>
                     <input
                       id="post-date"
                       type="datetime-local"
                       className={`form-input ${errors.scheduledFor ? 'error' : ''}`}
                       value={formatDateTimeLocal(formData.scheduledFor)}
                       onChange={handleChange('scheduledFor')}
                       aria-required="true"
                       aria-invalid={!!errors.scheduledFor}
                     />
                     {errors.scheduledFor && <span className="form-error" role="alert">{errors.scheduledFor}</span>}
                   </div>
   
                   <div className="form-group form-group-half">
                     <label htmlFor="post-status" className="form-label">Статус</label>
                     <select
                       id="post-status"
                       className="form-input form-select"
                       value={formData.status}
                       onChange={handleChange('status')}
                     >
                       {statusOptions.map(opt => (
                         <option key={opt.value} value={opt.value}>{opt.label}</option>
                       ))}
                     </select>
                   </div>
                 </div>
   
                 <div className="form-group">
                   <label htmlFor="post-audience" className="form-label">Цільова аудиторія</label>
                   <select
                     id="post-audience"
                     className="form-input form-select"
                     value={formData.audience}
                     onChange={handleChange('audience')}
                   >
                     {audienceOptions.map(opt => (
                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                   </select>
                 </div>
   
                 {/* 🔔 Опція сповіщень */}
                 <div className="form-checkbox-group">
                   <label className="checkbox-label">
                     <input type="checkbox" defaultChecked />
                     <span>Надіслати сповіщення підписникам після публікації</span>
                   </label>
                 </div>
               </div>
             )}
   
             {/* ⚙️ Вкладка: Додатково */}
             {activeSettingsTab === 'advanced' && (
               <div id="panel-advanced" role="tabpanel" aria-labelledby="tab-advanced">
                 <div className="form-group">
                   <label className="form-label">Автор</label>
                   <input
                     type="text"
                     className="form-input form-input-readonly"
                     value={post?.author || ''}
                     readOnly
                     aria-readonly="true"
                   />
                 </div>
   
                 <div className="form-group">
                   <label className="form-label">ID публікації</label>
                   <input
                     type="text"
                     className="form-input form-input-readonly"
                     value={`#${post?.id}`}
                     readOnly
                     aria-readonly="true"
                   />
                 </div>
   
                 {/* 🔗 Посилання на чернетку */}
                 <div className="form-group">
                   <label className="form-label">Посилання на чернетку</label>
                   <div className="input-with-copy">
                     <input
                       type="text"
                       className="form-input"
                       value={`https://app.example.com/draft/${post?.id}`}
                       readOnly
                     />
                     <button type="button" className="btn-copy" aria-label="Копіювати посилання">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                         <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                         <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                       </svg>
                     </button>
                   </div>
                 </div>
   
                 {/* ⚠️ Небезпечна зона */}
                 <div className="danger-zone">
                   <h4>Небезпечна зона</h4>
                   <p>Ці дії неможливо скасувати</p>
                   <button type="button" className="btn btn-danger">
                     🗑️ Видалити публікацію
                   </button>
                 </div>
               </div>
             )}
   
             {/* 🔘 Кнопки дій */}
             <div className="modal-actions">
               <button type="button" className="btn btn-secondary" onClick={onClose}>
                 Скасувати
               </button>
               <button type="submit" className="btn btn-primary">
                 💾 Зберегти зміни
               </button>
             </div>
           </form>
         </div>
       </div>,
       document.body
     );
   };
   
   // ============================================
   // 🧩 ДОПОМІЖНІ КОМПОНЕНТИ (Loading, Error, Empty, PostCard)
   // ============================================
   
   const LoadingState = () => (
     <div className="news-loading" role="status" aria-live="polite">
       <div className="loading-spinner" aria-hidden="true" />
       <p>Завантаження постів...</p>
     </div>
   );
   
   const ErrorState = ({ error, onRetry }) => (
     <div className="news-error" role="alert">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
         <circle cx="12" cy="12" r="10" />
         <line x1="12" y1="8" x2="12" y2="12" />
         <line x1="12" y1="16" x2="12.01" y2="16" />
       </svg>
       <p>{error}</p>
       <button onClick={onRetry} className="retry-btn">Повторити</button>
     </div>
   );
   
   const EmptyState = ({ platformName }) => (
     <div className="news-empty" role="status">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon" aria-hidden="true">
         <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
         <line x1="16" y1="2" x2="16" y2="6" />
         <line x1="8" y1="2" x2="8" y2="6" />
         <line x1="3" y1="10" x2="21" y2="10" />
       </svg>
       <p>Постів у {platformName} поки що немає.</p>
       <p className="empty-subtitle">Створіть першу публікацію, щоб розпочати!</p>
     </div>
   );
   
   /**
    * Компонент картки поста
    * @param {Object} props
    * @param {Object} props.post - Дані поста
    * @param {boolean} props.isVisible - Чи показувати анімацію появи
    * @param {Object} props.platform - Дані платформи
    * @param {Function} props.onEdit - Callback для редагування
    */
   const PostCard = ({ post, isVisible, platform, onEdit }) => {
     const statusConfig = {
       scheduled: { text: 'Заплановано', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.15)' },
       draft: { text: 'Чернетка', color: '#6c757d', bg: 'rgba(108, 117, 125, 0.15)' },
       published: { text: 'Опубліковано', color: '#28a745', bg: 'rgba(40, 167, 69, 0.15)' }
     };
     
     const status = statusConfig[post.status] || statusConfig.draft;
   
     return (
       <article
         className={`news-card ${isVisible ? 'news-card-visible' : ''}`}
         itemScope
         itemType="https://schema.org/SocialMediaPosting"
         aria-hidden={!isVisible}
       >
         <div className="news-card-content">
           <div className="news-card-header">
             <div className="news-card-badge" style={{ background: platform.badgeColor }} aria-label={`Платформа: ${platform.name}`}>
               <span className="platform-icon" aria-hidden="true">{platform.icon}</span>
               {platform.name}
             </div>
             <span className="status-badge" style={{ color: status.color, background: status.bg }} aria-label={`Статус: ${status.text}`}>
               {status.text}
             </span>
           </div>
   
           <div className="news-card-meta">
             <span className="news-card-author">{post.author}</span>
             <span className="news-card-dot" aria-hidden="true">•</span>
             <time className="news-card-time" dateTime={post.scheduledFor}>
               {new Date(post.scheduledFor).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
             </time>
           </div>
           
           <h2 className="news-card-title" itemProp="headline">{post.title}</h2>
           <p className="news-card-description" itemProp="description">{post.description}</p>
           
           {/* 🏷️ Показ тегів, якщо є */}
           {post.tags?.length > 0 && (
             <div className="news-card-tags">
               {post.tags.slice(0, 3).map((tag, i) => (
                 <span key={i} className="tag-pill">#{tag}</span>
               ))}
               {post.tags.length > 3 && <span className="tag-more">+{post.tags.length - 3}</span>}
             </div>
           )}
           
           <div className="news-card-footer">
             <button 
               className="news-card-link"
               onClick={(e) => { e.stopPropagation(); onEdit(post); }}
               aria-label={`Редагувати пост: ${post.title}`}
             >
               Редагувати
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="link-arrow" aria-hidden="true">
                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
               </svg>
             </button>
           </div>
         </div>
         <div className="news-card-shadow" aria-hidden="true" />
       </article>
     );
   };
   
   // ============================================
   // 🎬 ОСНОВНИЙ КОМПОНЕНТ: News
   // ============================================
   
   /**
    * Головний компонент для відображення та управління публікаціями
    * @returns {JSX.Element}
    */
   const News = () => {
     // Отримуємо стан та методи з кастомного хука
     const {
       posts,
       setPosts,
       loading,
       error,
       activePlatform,
       filteredPosts,
       visibleCards,
       handlePlatformChange,
       fetchPosts
     } = useNewsPosts();
   
     // 🪟 Стан для управління модальним вікном
     const [editingPost, setEditingPost] = useState(null);
   
     const currentPlatform = PLATFORMS[activePlatform];
   
     /**
      * Відкриття модального вікна для редагування поста
      */
     const handleEditPost = useCallback((post) => {
       setEditingPost(post);
     }, []);
   
     /**
      * Закриття модального вікна
      */
     const handleCloseModal = useCallback(() => {
       setEditingPost(null);
     }, []);
   
     /**
      * Збереження змін поста
      * @param {Object} updatedPost - Оновлені дані поста
      */
     const handleSavePost = useCallback((updatedPost) => {
       setPosts(prevPosts => 
         prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p)
       );
       console.log('✅ Пост оновлено:', updatedPost);
       // 🎉 Тут можна додати toast-повідомлення про успіх
     }, [setPosts]);
   
     // ============================================
     // 🔄 РЕНДЕРИНГ СТАНІВ: Loading / Error
     // ============================================
   
     if (loading) {
       return (
         <div className="news-container" role="region" aria-label="Пости">
           <header className="news-header">
             <h1 className="news-title">Публікації</h1>
             <p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p>
           </header>
           <LoadingState />
         </div>
       );
     }
   
     if (error) {
       return (
         <div className="news-container" role="region" aria-label="Пости">
           <header className="news-header">
             <h1 className="news-title">Публікації</h1>
             <p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p>
           </header>
           <ErrorState error={error} onRetry={fetchPosts} />
         </div>
       );
     }
   
     // ============================================
     // ✨ ОСНОВНИЙ РЕНДЕРИНГ
     // ============================================
   
     return (
       <div className="news-container" role="region" aria-label="Пости">
         {/* 🔝 Заголовок секції */}
         <header className="news-header">
           <h1 className="news-title">Публікації</h1>
           <p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p>
         </header>
   
         {/* 📊 Таби фільтрації за платформами */}
         <nav className="news-tabs" role="tablist" aria-label="Соціальні мережі">
           {Object.values(PLATFORMS).map((platform) => {
             const postCount = platform.id === 'all' 
               ? MOCK_POSTS.length 
               : MOCK_POSTS.filter(p => p.platform === platform.id).length;
             const isActive = activePlatform === platform.id;
             
             return (
               <button
                 key={platform.id}
                 role="tab"
                 aria-selected={isActive}
                 aria-controls={`${platform.id}-panel`}
                 id={`${platform.id}-tab`}
                 className={`news-tab-btn ${isActive ? 'active' : ''}`}
                 onClick={() => handlePlatformChange(platform.id)}
                 style={{ '--platform-color': platform.color }}
               >
                 <span className="platform-icon" aria-hidden="true">{platform.icon}</span>
                 <span className="platform-name">{platform.name}</span>
                 <span className="tab-count" aria-label={`${postCount} постів`}>{postCount}</span>
               </button>
             );
           })}
         </nav>
   
         {/* 📋 Панель контенту для активного табу */}
         <section 
           role="tabpanel"
           id={`${activePlatform}-panel`}
           aria-labelledby={`${activePlatform}-tab`}
           className="news-tab-panel"
         >
           <div className="news-list">
             {filteredPosts.map((post, index) => (
               <PostCard
                 key={post.id}
                 post={post}
                 isVisible={visibleCards.includes(index)}
                 platform={PLATFORMS[post.platform]}
                 onEdit={handleEditPost}
               />
             ))}
           </div>
   
           {filteredPosts.length === 0 && (
             <EmptyState platformName={currentPlatform.name} />
           )}
         </section>
   
         {/* 🪟 Модальне вікно редагування (рендериться через Portal) */}
         {editingPost && (
           <EditPostModal
             post={editingPost}
             platform={PLATFORMS[editingPost.platform]}
             onClose={handleCloseModal}
             onSave={handleSavePost}
           />
         )}
       </div>
     );
   };
   
   export default News;