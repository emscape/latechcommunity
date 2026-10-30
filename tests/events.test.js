import { createRequire } from 'node:module';
import { describe, it, expect, vi, afterEach } from 'vitest';

const require = createRequire(import.meta.url);
const {
    selectEvents, formatEventDate, formatAudience, truncate, fetchChapterEvents, FETCH_TIMEOUT_MS,
} = require('../scripts/events.js');

const NOW = new Date('2026-10-29T12:00:00Z');

function makeEvent(overrides) {
    return {
        id: 1,
        title: 'Sample Event',
        chapter_title: 'GDG Los Angeles',
        start_date: '2026-11-13T01:00:00Z',
        end_date: '2026-11-13T03:00:00Z',
        event_timezone: 'America/Los_Angeles',
        audience_type: 'IN_PERSON',
        description_short: 'A short description.',
        static_url: 'https://gdg.community.dev/e/abc/',
        is_hidden: false,
        ...overrides,
    };
}

describe('selectEvents', () => {
    it('merges chapter lists and sorts by start date', () => {
        const a = [makeEvent({ id: 2, title: 'Later', start_date: '2026-12-01T00:00:00Z', end_date: '2026-12-01T02:00:00Z' })];
        const b = [makeEvent({ id: 1, title: 'Sooner' })];
        expect(selectEvents([a, b], NOW).map((e) => e.title)).toEqual(['Sooner', 'Later']);
    });

    it('drops the same event listed by more than one chapter', () => {
        const devfest = makeEvent({ id: 9, title: 'DevFest' });
        expect(selectEvents([[devfest], [devfest], [devfest]], NOW)).toHaveLength(1);
    });

    it('keeps only the next occurrence of a repeating event', () => {
        const list = [
            makeEvent({ id: 3, title: 'Monthly Meetup', start_date: '2026-12-11T01:00:00Z', end_date: '2026-12-11T03:00:00Z' }),
            makeEvent({ id: 4, title: 'monthly meetup ', start_date: '2026-11-13T01:00:00Z' }),
        ];
        const result = selectEvents([list], NOW);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(4);
    });

    it('drops events that have ended, are hidden, or lack a link', () => {
        const list = [
            makeEvent({ id: 5, title: 'Past', start_date: '2026-10-01T00:00:00Z', end_date: '2026-10-01T02:00:00Z' }),
            makeEvent({ id: 6, title: 'Hidden', is_hidden: true }),
            makeEvent({ id: 7, title: 'No link', static_url: '' }),
            makeEvent({ id: 8, title: 'Kept' }),
        ];
        expect(selectEvents([list], NOW).map((e) => e.title)).toEqual(['Kept']);
    });

    it('keeps an event that is in progress', () => {
        const live = makeEvent({ start_date: '2026-10-29T11:00:00Z', end_date: '2026-10-29T13:00:00Z' });
        expect(selectEvents([[live]], NOW)).toHaveLength(1);
    });

    it('only accepts links on gdg.community.dev over https', () => {
        const list = [
            makeEvent({ id: 10, title: 'Bad scheme', static_url: 'javascript:alert(1)' }),
            makeEvent({ id: 11, title: 'Other host', static_url: 'https://example.com/e/x/' }),
            makeEvent({ id: 12, title: 'Good' }),
        ];
        expect(selectEvents([list], NOW).map((e) => e.title)).toEqual(['Good']);
    });

    it('limits the number of events returned', () => {
        const list = Array.from({ length: 10 }, (_, i) =>
            makeEvent({ id: i + 100, title: `Event ${i}`, start_date: `2026-11-${String(i + 10).padStart(2, '0')}T01:00:00Z`, end_date: `2026-11-${String(i + 10).padStart(2, '0')}T03:00:00Z` })
        );
        expect(selectEvents([list], NOW, 6)).toHaveLength(6);
    });
});

describe('formatEventDate', () => {
    it('shows the date and time in the event time zone', () => {
        const text = formatEventDate(makeEvent({ start_date: '2026-11-13T01:00:00Z' }));
        expect(text).toMatch(/Thu, Nov 12, 2026/);
        expect(text).toMatch(/5:00\sPM/);
        expect(text).toMatch(/PST/);
    });
});

describe('formatAudience', () => {
    it('maps audience types to readable labels', () => {
        expect(formatAudience('IN_PERSON')).toBe('In person');
        expect(formatAudience('VIRTUAL')).toBe('Virtual');
        expect(formatAudience('HYBRID')).toBe('In person & virtual');
        expect(formatAudience('UNKNOWN')).toBe('');
    });
});

describe('truncate', () => {
    it('leaves short text alone', () => {
        expect(truncate('Short text', 50)).toBe('Short text');
    });

    it('cuts long text at a word boundary and adds an ellipsis', () => {
        expect(truncate('one two three four five', 12)).toBe('one two…');
    });
});

describe('fetchChapterEvents', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('aborts a request that stalls past the timeout', async () => {
        vi.useFakeTimers();
        // A fetch that never answers on its own, only rejects when aborted
        vi.stubGlobal('fetch', vi.fn((url, { signal }) => new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => reject(new Error('aborted')));
        })));

        const request = fetchChapterEvents(1032);
        const assertion = expect(request).rejects.toThrow('aborted');
        await vi.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
        await assertion;
    });
});
