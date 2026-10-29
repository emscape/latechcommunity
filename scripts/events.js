/* ===========================
   EVENTS.JS
   Loads upcoming events from each chapter's gdg.community.dev (Bevy)
   page and renders them as cards with RSVP links.

   The endpoint is the one Bevy's own chapter pages call; it is not a
   documented public API and may change. It sends
   Access-Control-Allow-Origin: *, so no proxy is needed. On any failure
   the section keeps its static "View GDG LA Events" link.
   =========================== */

const EVENTS_API = 'https://gdg.community.dev/api/event_slim/for_chapter/';
const EVENT_HOST = 'gdg.community.dev';
const MAX_EVENTS = 6;
const DESCRIPTION_LENGTH = 160;
const FETCH_TIMEOUT_MS = 8000;

// Chapter IDs come from each chapter page's `chapter_id` script variable
const CHAPTERS = [
    { id: 1032, name: 'GDG Los Angeles' },
    { id: 232, name: 'GDG Culver City' },
    { id: 279, name: 'GDG Cloud San Fernando Valley' },
];

const AUDIENCE_LABELS = {
    IN_PERSON: 'In person',
    VIRTUAL: 'Virtual',
    HYBRID: 'In person & virtual',
};

/**
 * Only link out to https event pages on the chapter platform, so a
 * malformed or unexpected URL in the feed never becomes an href
 */
function isEventUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && parsed.hostname === EVENT_HOST;
    } catch {
        return false;
    }
}

/**
 * Merge per-chapter event lists into one list for display. Co-hosted
 * events (e.g. DevFest) appear under every host chapter, so they are
 * deduped by id; repeating events (e.g. a monthly meetup) are posted
 * as separate events, so only the next one with a given title is kept.
 */
function selectEvents(chapterLists, now = new Date(), limit = MAX_EVENTS) {
    const seenIds = new Set();
    const seenTitles = new Set();

    return chapterLists
        .flat()
        .filter((event) => !event.is_hidden && isEventUrl(event.static_url))
        .filter((event) => new Date(event.end_date || event.start_date) > now)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .filter((event) => {
            const titleKey = event.title.trim().toLowerCase();
            if (seenIds.has(event.id) || seenTitles.has(titleKey)) return false;
            seenIds.add(event.id);
            seenTitles.add(titleKey);
            return true;
        })
        .slice(0, limit);
}

function formatEventDate(event) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: event.event_timezone || 'America/Los_Angeles',
        timeZoneName: 'short',
    }).format(new Date(event.start_date));
}

function formatAudience(audienceType) {
    return AUDIENCE_LABELS[audienceType] || '';
}

function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    const cut = text.slice(0, maxLength + 1);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`;
}

async function fetchChapterEvents(chapterId) {
    const params = new URLSearchParams({
        status: 'Live',
        include_cohosted_events: 'true',
        visible_on_parent_chapter_only: 'true',
        order: 'start_date',
        page_size: '50',
    });
    const options = typeof AbortSignal.timeout === 'function'
        ? { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) }
        : {};
    const response = await fetch(`${EVENTS_API}${chapterId}/?${params}`, options);
    if (!response.ok) throw new Error(`Chapter ${chapterId}: HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.results) ? data.results : [];
}

/**
 * Build one card. All feed text is set through textContent, never
 * innerHTML, since it comes from a third-party service.
 */
function createEventCard(event) {
    const item = document.createElement('li');
    item.className = 'events__item';

    const card = document.createElement('article');
    card.className = 'event-card';

    const title = document.createElement('h4');
    title.className = 'event-card__title';
    title.textContent = event.title;

    const date = document.createElement('time');
    date.className = 'event-card__date';
    date.dateTime = event.start_date;
    date.textContent = formatEventDate(event);

    const meta = document.createElement('p');
    meta.className = 'event-card__meta';
    meta.textContent = [event.chapter_title, formatAudience(event.audience_type)]
        .filter(Boolean)
        .join(' · ');

    card.append(title, date, meta);

    if (event.description_short) {
        const description = document.createElement('p');
        description.className = 'event-card__description';
        description.textContent = truncate(event.description_short.trim(), DESCRIPTION_LENGTH);
        card.append(description);
    }

    const rsvp = document.createElement('a');
    rsvp.className = 'btn btn--sm btn--primary event-card__rsvp';
    rsvp.href = event.static_url;
    rsvp.target = '_blank';
    rsvp.rel = 'noopener noreferrer';
    rsvp.textContent = 'RSVP';
    rsvp.setAttribute('aria-label', `RSVP for ${event.title} (opens in a new tab)`);
    card.append(rsvp);

    item.append(card);
    return item;
}

async function initEvents() {
    const list = document.querySelector('[data-events-list]');
    const status = document.querySelector('[data-events-status]');
    if (!list || !status) return;

    const fallbackText = status.textContent;
    status.textContent = 'Loading upcoming events…';

    const results = await Promise.allSettled(CHAPTERS.map((chapter) => fetchChapterEvents(chapter.id)));
    const lists = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
    const events = selectEvents(lists);

    if (events.length === 0) {
        status.textContent = fallbackText;
        return;
    }

    list.replaceChildren(...events.map(createEventCard));
    list.hidden = false;
    status.textContent = '';
    status.hidden = true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { selectEvents, formatEventDate, formatAudience, truncate, isEventUrl };
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
} else {
    initEvents();
}
