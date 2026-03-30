// News.jsx
import React, { Suspense, lazy, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import './News.css';

/* ============================================
   LOADER (Прозорий Fallback для Suspense)
   ============================================ */
const NewsLoader = () => (
  <div className="loader-overlay" role="status" aria-live="polite">
    <div className="loader-content">
      <div className="loader-spinner" aria-hidden="true" />
      <p>Завантаження публікацій...</p>
    </div>
  </div>
);

/* ============================================
   КОНСТАНТИ ТА КОНФІГУРАЦІЯ
   ============================================ */
const PLATFORMS = {
  all: { id: 'all', name: 'Всі мережі', color: '#8a5fe0', badgeColor: 'linear-gradient(135deg, #8a5fe0 0%, #6d44b8 100%)' },
  instagram: { id: 'instagram', name: 'Instagram', color: '#E4405F', badgeColor: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)', settings: { maxMediaFiles: 10, allowedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4'], maxFileSizeMB: 100, supportsStories: true, supportsReels: true } },
  facebook: { id: 'facebook', name: 'Facebook', color: '#1877F2', badgeColor: 'linear-gradient(135deg, #1877F2 0%, #42B72A 100%)', settings: { maxMediaFiles: 5, allowedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'], maxFileSizeMB: 250, supportsStories: true, supportsReels: false } },
  youtube: { id: 'youtube', name: 'YouTube', color: '#FF0000', badgeColor: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)', settings: { maxMediaFiles: 1, allowedMediaTypes: ['video/mp4', 'video/quicktime', 'video/x-matroska'], maxFileSizeMB: 256, supportsStories: false, supportsReels: false, supportsShorts: true, minVideoDuration: 12, maxVideoDuration: 43200, recommendedResolution: '1920x1080', recommendedAspectRatio: '16:9' } },
  twitter: { id: 'twitter', name: 'Twitter', color: '#000000', badgeColor: 'linear-gradient(135deg, #000000 0%, #1DA1F2 100%)', settings: { maxMediaFiles: 4, allowedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'], maxFileSizeMB: 512, supportsStories: false, supportsReels: false, supportsThreads: true, maxTextLength: 280, recommendedImageResolution: '1600x900', recommendedVideoResolution: '1280x720', recommendedAspectRatio: '16:9 or 1:1' } },
  tiktok: { id: 'tiktok', name: 'TikTok', color: '#000000', badgeColor: 'linear-gradient(135deg, #000000 0%, #69C9D0 100%)', settings: { maxMediaFiles: 1, allowedMediaTypes: ['video/mp4', 'video/quicktime'], maxFileSizeMB: 287, supportsStories: false, supportsReels: false, verticalVideoOnly: true } }
};

const MOCK_PUBLICATIONS = [
  { id: 4, platform: 'instagram', title: 'Stories: За лаштунками', description: 'Показали процес створення контенту для бренду.', author: 'Content Team', scheduledFor: '2026-03-16T10:00', status: 'draft', media: [], audience: 'followers' },
  { id: 7, platform: 'instagram', title: 'Reels: Тренди весни', description: 'Відео-огляд модних тенденцій нового сезону.', author: 'Creative Team', scheduledFor: '2026-03-17T18:00', status: 'published', media: [], audience: 'all' },
  { id: 10, platform: 'instagram', title: 'IGTV: Інтерв\'ю з засновником', description: 'Ексклюзивне інтерв\'ю про місію бренду та плани на майбутнє.', author: 'PR Team', scheduledFor: '2026-03-18T12:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 13, platform: 'instagram', title: 'Carousel: 5 способів стилізації', description: 'Гайд по комбінуванню базових речей з нової колекції.', author: 'Style Team', scheduledFor: '2026-03-19T15:30', status: 'draft', media: [], audience: 'all' },
  { id: 16, platform: 'instagram', title: 'Giveaway: Розіграш подарунків', description: 'Запустіли конкурс для підписників з цінними призами.', author: 'Community Team', scheduledFor: '2026-03-20T09:00', status: 'published', media: [], audience: 'all' },
  { id: 2, platform: 'facebook', title: 'Анонс вебінару для клієнтів', description: 'Запрошуємо на безкоштовний вебінар з цифрового маркетингу.', author: 'Sales Team', scheduledFor: '2026-03-20T16:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 5, platform: 'facebook', title: 'Оновлення політики конфіденційності', description: 'Інформуємо про зміни у обробці персональних даних.', author: 'Legal Team', scheduledFor: '2026-03-18T09:00', status: 'draft', media: [], audience: 'all' },
  { id: 8, platform: 'facebook', title: 'Відгуки клієнтів: Історія успіху', description: 'Поділилися реальним кейсом співпраці з партнером.', author: 'PR Team', scheduledFor: '2026-03-19T12:00', status: 'published', media: [], audience: 'all' },
  { id: 11, platform: 'facebook', title: 'Live-трансляція: Питання-відповіді', description: 'Пряма ефір з експертами компанії для відповідей на запитання.', author: 'Support Team', scheduledFor: '2026-03-21T18:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 14, platform: 'facebook', title: 'Стаття: Тренди індустрії 2026', description: 'Аналітичний огляд ключових тенденцій ринку цього року.', author: 'Analytics Team', scheduledFor: '2026-03-22T10:00', status: 'draft', media: [], audience: 'all' },
  { id: 17, platform: 'facebook', title: 'Подія: Запрошення на конференцію', description: 'Реєстрація відкрита на щорічну галузеву конференцію.', author: 'Events Team', scheduledFor: '2026-03-23T14:00', status: 'published', media: [], audience: 'all' },
  { id: 3, platform: 'tiktok', title: 'Челендж #BrandChallenge', description: 'Запустили вірусний челендж для залучення аудиторії.', author: 'Viral Team', scheduledFor: '2026-03-21T20:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 6, platform: 'tiktok', title: 'Туторіал: Як використовувати продукт', description: 'Коротке відео-інструкція з використанням трендових звуків.', author: 'Education Team', scheduledFor: '2026-03-22T15:00', status: 'draft', media: [], audience: 'all' },
  { id: 9, platform: 'tiktok', title: 'Behind the scenes: Офіс', description: 'Показали атмосферу в офісі та команду за роботою.', author: 'HR Team', scheduledFor: '2026-03-23T11:00', status: 'published', media: [], audience: 'all' },
  { id: 12, platform: 'tiktok', title: 'Duet з інфлюенсером', description: 'Спільне відео з популярним креатором для розширення охоплення.', author: 'Influencer Team', scheduledFor: '2026-03-24T19:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 15, platform: 'tiktok', title: 'Трендовий звук + наш продукт', description: 'Адаптували вірусний аудіо-тренд під потреби бренду.', author: 'Creative Team', scheduledFor: '2026-03-25T16:30', status: 'draft', media: [], audience: 'all' },
  { id: 18, platform: 'tiktok', title: 'UGC-контент: Відео від користувачів', description: 'Зібрали найкращі відео від нашої спільноти в одному ролику.', author: 'Community Team', scheduledFor: '2026-03-26T13:00', status: 'published', media: [], audience: 'all' },
  { id: 20, platform: 'youtube', title: 'YouTube Shorts: Швидкі поради', description: 'Серія коротких відео з корисними лайфхаками для користувачів.', author: 'Shorts Team', scheduledFor: '2026-03-28T12:00', status: 'draft', media: [], audience: 'all' },
  { id: 21, platform: 'youtube', title: 'Live: Прем\'єра нового відео', description: 'Спільний перегляд прем\'єри з коментарями команди в реальному часі.', author: 'Live Team', scheduledFor: '2026-03-29T19:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 22, platform: 'youtube', title: 'Туторіал: Покрокова інструкція', description: 'Детальне відео-керівництво з налаштування та використання сервісу.', author: 'Tutorial Team', scheduledFor: '2026-03-30T14:30', status: 'published', media: [], audience: 'all' },
  { id: 23, platform: 'youtube', title: 'Vlog: День з командою', description: 'За лаштунками нашої роботи: зустрічі, ідеї та креативні процеси.', author: 'Vlog Team', scheduledFor: '2026-03-31T16:00', status: 'draft', media: [], audience: 'all' },
  { id: 24, platform: 'youtube', title: 'Інтерв\'ю: Експерт галузі', description: 'Розмова з провідним експертом про тренди та майбутнє індустрії.', author: 'Interview Team', scheduledFor: '2026-04-01T11:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 25, platform: 'twitter', title: 'Тред: 5 порад для росту бренду', description: 'Серія твітів з практичними рекомендаціями для підприємців.', author: 'Growth Team', scheduledFor: '2026-04-02T10:00', status: 'draft', media: [], audience: 'all' },
  { id: 26, platform: 'twitter', title: 'Анонс нового функціоналу', description: 'Короткий твіт про оновлення продукту з посиланням на блог.', author: 'Product Team', scheduledFor: '2026-04-03T14:30', status: 'scheduled', media: [], audience: 'all' },
  { id: 27, platform: 'twitter', title: 'Poll: Думка спільноти', description: 'Опитування для залучення аудиторії та збору фідбеку.', author: 'Community Team', scheduledFor: '2026-04-04T16:00', status: 'draft', media: [], audience: 'all' },
  { id: 28, platform: 'twitter', title: 'Thread: Історія успіху клієнта', description: 'Кейс у форматі треду з реальними результатами та метриками.', author: 'Case Study Team', scheduledFor: '2026-04-05T11:00', status: 'published', media: [], audience: 'all' },
  { id: 29, platform: 'twitter', title: 'Live Tweeting з події', description: 'Онлайн-освітлення галузевої конференції в реальному часі.', author: 'Events Team', scheduledFor: '2026-04-06T09:00', status: 'scheduled', media: [], audience: 'all' },
  { id: 30, platform: 'twitter', title: 'GIF + жарт про індустрію', description: 'Легкий вірусний контент для підвищення залученості.', author: 'Creative Team', scheduledFor: '2026-04-07T18:00', status: 'draft', media: [], audience: 'all' }
];

/* ============================================
   CUSTOM HOOK: usePublications
   ============================================ */
const usePublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const [activePlatform, setActivePlatform] = useState('all');

  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      setPublications(MOCK_PUBLICATIONS);
      setVisibleCards([]);
      MOCK_PUBLICATIONS.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 50);
      });
    } catch (err) {
      setError('Не вдалося завантажити публікації. Спробуйте пізніше.');
      console.error('Publications fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPublications(); }, [fetchPublications]);

  const filteredPublications = useMemo(() => {
    if (activePlatform === 'all') return publications;
    return publications.filter(pub => pub.platform === activePlatform);
  }, [publications, activePlatform]);

  useEffect(() => {
    setVisibleCards([]);
    filteredPublications.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 50);
    });
  }, [activePlatform, filteredPublications.length]);

  const handlePlatformChange = useCallback((platformId) => {
    setActivePlatform(platformId);
  }, []);

  return { publications, setPublications, loading, error, activePlatform, filteredPublications, visibleCards, handlePlatformChange, fetchPublications };
};

/* ============================================
   КОМПОНЕНТ: MediaUploadPreview
   ============================================ */
const MediaUploadPreview = ({ platform, mediaFiles, onFilesChange, onRemoveFile, onClearAll }) => {
  const fileInputRef = useRef(null);
  const platformSettings = PLATFORMS[platform]?.settings;
  const maxFiles = platformSettings?.maxMediaFiles || 2;
  const allowedTypes = platformSettings?.allowedMediaTypes || ['image/*', 'video/*'];
  const maxSizeBytes = (platformSettings?.maxFileSizeMB || 50) * 1024 * 1024;
  const remainingSlots = maxFiles - mediaFiles.length;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    files.forEach(file => {
      if (!allowedTypes.some(type => type.endsWith('/*') ? file.type.startsWith(type.split('/')[0]) : file.type === type)) {
        alert(`Файл "${file.name}" має недопустимий формат`);
        return;
      }
      if (file.size > maxSizeBytes) {
        alert(`Файл "${file.name}" перевищує ліміт ${platformSettings?.maxFileSizeMB || 50}MB`);
        return;
      }
      validFiles.push(file);
    });
    if (validFiles.length > 0 && remainingSlots > 0) {
      const filesToAdd = validFiles.slice(0, remainingSlots);
      onFilesChange([...mediaFiles, ...filesToAdd]);
    }
    e.target.value = '';
  };

  const getFilePreview = (file) => file.type.startsWith('image/') || file.type.startsWith('video/') ? URL.createObjectURL(file) : null;
  const formatFileName = (name, maxLength = 20) => name.length <= maxLength ? name : `${name.slice(0, maxLength - name.split('.').pop().length - 4)}...${name.split('.').pop()}`;

  return (
    <div className="media-upload-section">
      <div className={`media-dropzone ${remainingSlots <= 0 ? 'disabled' : ''}`} onClick={() => remainingSlots > 0 && fileInputRef.current?.click()} role="button" tabIndex={remainingSlots > 0 ? 0 : -1} aria-disabled={remainingSlots <= 0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (remainingSlots > 0) fileInputRef.current?.click(); } }}>
        <input ref={fileInputRef} type="file" multiple accept={allowedTypes.join(',')} onChange={handleFileSelect} className="media-input-hidden" aria-label="Завантажити медіафайли" />
        {remainingSlots > 0 ? (<>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropzone-icon" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <span className="dropzone-text">Натисніть або перетягніть файли сюди</span>
          <span className="dropzone-subtext">{allowedTypes.map(t => t.replace('*','')).join(', ').toUpperCase()}</span>
        </>) : <span className="dropzone-full">Досягнуто ліміт файлів ({maxFiles})</span>}
      </div>
      {mediaFiles.length > 0 && (
        <div className="media-preview-grid">
          {mediaFiles.slice(0, 2).map((file, index) => {
            const previewUrl = getFilePreview(file);
            const isVideo = file.type.startsWith('video/');
            return (
              <div key={index} className="media-preview-item">
                {isVideo ? <video src={previewUrl} className="media-preview-media" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} /> : <img src={previewUrl} alt={file.name} className="media-preview-media" />}
                <div className="media-preview-info">
                  <span className="media-preview-name" title={file.name}>{formatFileName(file.name)}</span>
                  <span className="media-preview-size">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                <button type="button" className="media-preview-remove" onClick={(e) => { e.stopPropagation(); onRemoveFile(index); }} aria-label={`Видалити файл ${file.name}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                <span className="media-preview-order">{index + 1}</span>
              </div>
            );
          })}
          {mediaFiles.length > 2 && <div className="media-preview-more">+{mediaFiles.length - 2} ще</div>}
          {onClearAll && mediaFiles.length > 0 && <button type="button" className="media-clear-all" onClick={(e) => { e.stopPropagation(); onClearAll(); }}>Очистити все</button>}
        </div>
      )}
    </div>
  );
};

/* ============================================
   МОДАЛЬНЕ ВІКНО: EditPublicationModal
   ============================================ */
const EditPublicationModal = ({ publication, platform, onClose, onSave, onDelete }) => {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const [formData, setFormData] = useState({ title: publication?.title || '', description: publication?.description || '', scheduledFor: publication?.scheduledFor || '', status: publication?.status || 'draft', audience: publication?.audience || 'all', media: publication?.media || [] });
  const [errors, setErrors] = useState({});
  const [activeSettingsTab, setActiveSettingsTab] = useState('content');
  const [sendNotification, setSendNotification] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { if (firstInputRef.current) firstInputRef.current.focus(); }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0], lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstElement) { e.preventDefault(); lastElement.focus(); }
        else if (!e.shiftKey && document.activeElement === lastElement) { e.preventDefault(); firstElement.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = 'unset'; };
  }, [onClose]);

  const validate = () => { const newErrors = {}; if (!formData.title.trim()) newErrors.title = "Заголовок обов'язковий"; if (!formData.description.trim()) newErrors.description = "Опис обов'язковий"; if (!formData.scheduledFor) newErrors.scheduledFor = "Оберіть дату публікації"; setErrors(newErrors); return Object.keys(newErrors).length === 0; };
  const handleChange = (field) => (e) => { setFormData(prev => ({ ...prev, [field]: e.target.value })); if (errors[field]) setErrors(prev => ({ ...prev, [field]: null })); };
  const handleMediaFilesChange = (files) => setFormData(prev => ({ ...prev, media: files }));
  const handleRemoveMediaFile = (index) => setFormData(prev => ({ ...prev, media: prev.media.filter((_, i) => i !== index) }));
  const handleClearAllMedia = () => setFormData(prev => ({ ...prev, media: [] }));
  const handleSubmit = (e) => { e.preventDefault(); if (validate()) { onSave({ ...publication, ...formData, sendNotification }); onClose(); } };
  const handleDelete = () => { if (window.confirm(`Ви впевнені, що хочете видалити публікацію "${formData.title}"?`)) { setIsDeleting(true); setTimeout(() => { onDelete?.(publication.id); onClose(); setIsDeleting(false); }, 300); } };
  const handleCopyLink = async () => { const link = `https://app.example.com/draft/${publication?.id}`; try { await navigator.clipboard.writeText(link); alert('Посилання скопійовано!'); } catch (err) { const textarea = document.createElement('textarea'); textarea.value = link; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); alert('Посилання скопійовано!'); } };

  const statusOptions = [{ value: '', label: 'Оберіть статус', disabled: true }, { value: 'draft', label: 'Чернетка' }, { value: 'scheduled', label: 'Заплановано' }, { value: 'published', label: 'Опубліковано' }];
  const audienceOptions = [{ value: '', label: 'Оберіть аудиторію', disabled: true }, { value: 'all', label: 'Всім підписникам' }, { value: 'followers', label: 'Тільки активним підписникам' }, { value: 'custom', label: 'Обрана аудиторія' }];
  const formatDateTimeLocal = (dateStr) => dateStr ? new Date(dateStr).toISOString().slice(0, 16) : '';
  const settingsTabs = [{ id: 'content', label: 'Контент' }, { id: 'media', label: 'Медіа' }, { id: 'schedule', label: 'Публікація' }, { id: 'advanced', label: 'Додатково' }];

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content modal-content-large" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <h2 id="modal-title" className="modal-title">Редагувати публікацію</h2>
            <div className="modal-platform-badge" style={{ background: platform?.badgeColor }}>{platform?.name}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Закрити модальне вікно"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div className="modal-tabs">{settingsTabs.map(tab => (<button key={tab.id} className={`modal-tab-btn ${activeSettingsTab === tab.id ? 'active' : ''}`} onClick={() => setActiveSettingsTab(tab.id)} role="tab" aria-selected={activeSettingsTab === tab.id} aria-controls={`panel-${tab.id}`}>{tab.label}</button>))}</div>
        <form onSubmit={handleSubmit} className="modal-form">
          {activeSettingsTab === 'content' && (<div id="panel-content" role="tabpanel" aria-labelledby="tab-content">
            <div className="form-group"><input ref={firstInputRef} id="publication-title" type="text" className={`form-input ${errors.title ? 'error' : ''}`} value={formData.title} onChange={handleChange('title')} placeholder="Заголовок публікації *" aria-required="true" aria-invalid={!!errors.title} />{errors.title && <span className="form-error" role="alert">{errors.title}</span>}</div>
            <div className="form-group"><textarea id="publication-description" className={`form-input form-textarea ${errors.description ? 'error' : ''}`} value={formData.description} onChange={handleChange('description')} placeholder="Опис змісту публікації *" rows={4} aria-required="true" aria-invalid={!!errors.description} />{errors.description && <span className="form-error" role="alert">{errors.description}</span>}</div>
          </div>)}
          {activeSettingsTab === 'media' && (<div id="panel-media" role="tabpanel" aria-labelledby="tab-media">
            <MediaUploadPreview platform={platform?.id} mediaFiles={formData.media} onFilesChange={handleMediaFilesChange} onRemoveFile={handleRemoveMediaFile} onClearAll={handleClearAllMedia} />
            <div className="platform-tips"><h4>Рекомендації для {platform?.name}:</h4><ul>
              {platform?.id === 'instagram' && (<><li>Оптимальне співвідношення: 1:1 (квадрат) або 4:5</li><li>Reels: вертикальне відео 9:16, до 90 секунд</li><li>Stories: 9:16, до 15 секунд на слайд</li></>)}
              {platform?.id === 'facebook' && (<><li>Рекомендовано: 1200x630px для посилань</li><li>Відео: до 240 хвилин, MP4 формат</li></>)}
              {platform?.id === 'tiktok' && (<><li>Тільки вертикальне відео 9:16</li><li>Оптимальна тривалість: 15-60 секунд</li><li>Використовуйте трендові звуки для більшого охоплення</li></>)}
              {platform?.id === 'youtube' && (<><li>Рекомендоване співвідношення: 16:9 (1920x1080)</li><li>Shorts: вертикальне відео 9:16, до 60 секунд</li><li>Мінімальна тривалість: 12 секунд, максимальна: 12 годин</li><li>Підтримувані формати: MP4, MOV, MKV</li></>)}
              {platform?.id === 'twitter' && (<><li>Максимальна довжина тексту: 280 символів</li><li>До 4 медіафайлів в одному твіті (зображення, відео)</li><li>Рекомендоване співвідношення: 16:9 або 1:1 для зображень</li><li>Відео: до 2 хвилин 20 секунд для звичайних користувачів</li></>)}
            </ul></div>
          </div>)}
          {activeSettingsTab === 'schedule' && (<div id="panel-schedule" role="tabpanel" aria-labelledby="tab-schedule">
            <div className="form-row">
              <div className="form-group form-group-half"><input id="publication-date" type="datetime-local" className={`form-input ${errors.scheduledFor ? 'error' : ''}`} value={formatDateTimeLocal(formData.scheduledFor)} onChange={handleChange('scheduledFor')} aria-required="true" aria-invalid={!!errors.scheduledFor} />{errors.scheduledFor && <span className="form-error" role="alert">{errors.scheduledFor}</span>}</div>
              <div className="form-group form-group-half"><select id="publication-status" className="form-input form-select" value={formData.status} onChange={handleChange('status')}>{statusOptions.map(opt => (<option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>))}</select></div>
            </div>
            <div className="form-group"><select id="publication-audience" className="form-input form-select" value={formData.audience} onChange={handleChange('audience')}>{audienceOptions.map(opt => (<option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>))}</select></div>
            <div className="form-checkbox-group"><label className="checkbox-label"><input type="checkbox" checked={sendNotification} onChange={(e) => setSendNotification(e.target.checked)} /><span>Надіслати сповіщення підписникам після публікації</span></label></div>
          </div>)}
          {activeSettingsTab === 'advanced' && (<div id="panel-advanced" role="tabpanel" aria-labelledby="tab-advanced">
            <div className="form-group"><input type="text" className="form-input form-input-readonly" value={publication?.author || ''} placeholder="Автор" readOnly aria-readonly="true" /></div>
            <div className="form-group"><input type="text" className="form-input form-input-readonly" value={`#${publication?.id}`} placeholder="ID публікації" readOnly aria-readonly="true" /></div>
            <div className="form-group"><div className="input-with-copy"><input type="text" className="form-input" value={`https://app.example.com/draft/${publication?.id}`} placeholder="Посилання на чернетку" readOnly /><button type="button" className="btn-copy" onClick={handleCopyLink} aria-label="Копіювати посилання"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button></div></div>
            <div className="danger-zone"><button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? 'Видалення...' : 'Видалити публікацію'}</button></div>
          </div>)}
          <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Скасувати</button><button type="submit" className="btn btn-primary">Зберегти зміни</button></div>
        </form>
      </div>
    </div>,
    document.body
  );
};

/* ============================================
   ДОПОМІЖНІ КОМПОНЕНТИ
   ============================================ */
const ErrorState = ({ error, onRetry }) => (<div className="news-error" role="alert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg><p>{error}</p><button onClick={onRetry} className="retry-btn">Повторити</button></div>);
const EmptyState = ({ platformName, onCreatePublication }) => (<div className="news-empty" role="status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg><p>Публікацій у {platformName} поки що немає.</p><p className="empty-subtitle">Створіть першу публікацію, щоб розпочати!</p>{onCreatePublication && <button className="btn btn-primary" onClick={onCreatePublication}>Створити публікацію</button>}</div>);
const PublicationCard = ({ publication, isVisible, platform, onEdit }) => {
  const statusConfig = { scheduled: { text: 'Заплановано', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.15)' }, draft: { text: 'Чернетка', color: '#6c757d', bg: 'rgba(108, 117, 125, 0.15)' }, published: { text: 'Опубліковано', color: '#28a745', bg: 'rgba(40, 167, 69, 0.15)' } };
  const status = statusConfig[publication.status] || statusConfig.draft;
  return (<article className={`news-card ${isVisible ? 'news-card-visible' : ''}`} itemScope itemType="https://schema.org/SocialMediaPosting" aria-hidden={!isVisible}>
    <div className="news-card-content">
      <div className="news-card-header"><div className="news-card-badge" style={{ background: platform.badgeColor }} aria-label={`Платформа: ${platform.name}`}>{platform.name}</div><span className="status-badge" style={{ color: status.color, background: status.bg }} aria-label={`Статус: ${status.text}`}>{status.text}</span></div>
      <div className="news-card-meta"><span className="news-card-author">{publication.author}</span><span className="news-card-dot" aria-hidden="true">•</span><time className="news-card-time" dateTime={publication.scheduledFor}>{new Date(publication.scheduledFor).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</time></div>
      <h2 className="news-card-title" itemProp="headline">{publication.title}</h2><p className="news-card-description" itemProp="description">{publication.description}</p>
      <div className="news-card-footer"><button className="news-card-link" onClick={(e) => { e.stopPropagation(); onEdit(publication); }} aria-label={`Редагувати публікацію: ${publication.title}`}>Редагувати<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="link-arrow" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button></div>
    </div><div className="news-card-shadow" aria-hidden="true" />
  </article>);
};

/* ============================================
   ОСНОВНИЙ КОНТЕНТ 
   ============================================ */
const NewsContent = () => {
  const { publications, setPublications, error, activePlatform, filteredPublications, visibleCards, handlePlatformChange, fetchPublications } = usePublications();
  const [editingPublication, setEditingPublication] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const currentPlatform = PLATFORMS[activePlatform];

  const handleEditPublication = useCallback((publication) => setEditingPublication(publication), []);
  const handleCreatePublication = useCallback(() => {
    const newPublication = { id: Date.now(), platform: activePlatform === 'all' ? 'instagram' : activePlatform, title: '', description: '', author: 'Ви', scheduledFor: new Date().toISOString().slice(0, 16), status: 'draft', media: [], audience: 'all' };
    setEditingPublication(newPublication); setIsCreating(true);
  }, [activePlatform]);
  const handleCloseModal = useCallback(() => { setEditingPublication(null); setIsCreating(false); }, []);
  const handleSavePublication = useCallback((updatedPublication) => {
    if (isCreating) setPublications(prevPublications => [...prevPublications, updatedPublication]);
    else setPublications(prevPublications => prevPublications.map(p => p.id === updatedPublication.id ? updatedPublication : p));
  }, [setPublications, isCreating]);
  const handleDeletePublication = useCallback((publicationId) => { if (window.confirm('Ви впевнені, що хочете видалити цю публікацію?')) setPublications(prev => prev.filter(p => p.id !== publicationId)); }, [setPublications]);

  if (error) return (<div className="news-container" role="region" aria-label="Публікації"><header className="news-header"><h1 className="news-title">Публікації</h1><p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p></header><ErrorState error={error} onRetry={fetchPublications} /></div>);

  return (<div className="news-container" role="region" aria-label="Публікації">
    <header className="news-header"><h1 className="news-title">Публікації</h1><p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p></header>
    <nav className="news-tabs" role="tablist" aria-label="Соціальні мережі">{Object.values(PLATFORMS).map((platform) => { const publicationCount = platform.id === 'all' ? MOCK_PUBLICATIONS.length : MOCK_PUBLICATIONS.filter(p => p.platform === platform.id).length; const isActive = activePlatform === platform.id; return (<button key={platform.id} role="tab" aria-selected={isActive} aria-controls={`${platform.id}-panel`} id={`${platform.id}-tab`} className={`news-tab-btn ${isActive ? 'active' : ''}`} onClick={() => handlePlatformChange(platform.id)} style={{ '--platform-color': platform.color }}><span className="platform-name">{platform.name}</span><span className="tab-count" aria-label={`${publicationCount} публікацій`}>{publicationCount}</span></button>); })}</nav>
    <section role="tabpanel" id={`${activePlatform}-panel`} aria-labelledby={`${activePlatform}-tab`} className="news-tab-panel">
      <div className="news-list">{filteredPublications.map((publication, index) => (<PublicationCard key={publication.id} publication={publication} isVisible={visibleCards.includes(index)} platform={PLATFORMS[publication.platform]} onEdit={handleEditPublication} />))}</div>
      {filteredPublications.length === 0 && <EmptyState platformName={currentPlatform.name} onCreatePublication={activePlatform !== 'all' ? handleCreatePublication : undefined} />}
    </section>
    {editingPublication && <EditPublicationModal publication={editingPublication} platform={PLATFORMS[editingPublication.platform]} onClose={handleCloseModal} onSave={handleSavePublication} onDelete={handleDeletePublication} />}
  </div>);
};

/* ============================================
   LAZY-ЗАВАНТАЖЕННЯ
   ============================================ */
// Для демо з імітацією мережевої затримки:
const NewsContentLazy = lazy(() => new Promise((resolve) => { setTimeout(() => resolve({ default: NewsContent }), 500); }));

/* ============================================
   ЕКСПОРТ ГОЛОВНОГО КОМПОНЕНТА
   ============================================ */
const News = () => (<Suspense fallback={<NewsLoader />}><NewsContentLazy /></Suspense>);

export default News;