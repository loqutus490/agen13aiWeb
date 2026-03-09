import test from 'node:test';
import assert from 'node:assert/strict';
import { slugifyTopic, dedupeSources, canTransitionStatus, hasDailyDuplicate, extractJsonObject, wordCountFromHtml, shouldSkipRunForDay, canSendNewsletter } from './content-automation.helpers.js';

test('slugifyTopic creates clean slugs', () => {
  assert.equal(slugifyTopic('AI for Law Firms: 2026!'), 'ai-for-law-firms-2026');
});

test('dedupeSources removes duplicate source items', () => {
  const items = [
    { title: 'A', link: 'https://a.com', score: 1 },
    { title: 'A', link: 'https://a.com', score: 2 },
    { title: 'B', link: 'https://b.com', score: 3 },
  ];
  assert.equal(dedupeSources(items).length, 2);
});

test('canTransitionStatus enforces review workflow', () => {
  assert.equal(canTransitionStatus('pending_review', 'approved'), true);
  assert.equal(canTransitionStatus('pending_review', 'published'), false);
});

test('hasDailyDuplicate catches same title same day', () => {
  assert.equal(hasDailyDuplicate([{ title: 'Topic', date: '2026-03-09' }], 'topic', '2026-03-09'), true);
  assert.equal(hasDailyDuplicate([{ title: 'Topic', date: '2026-03-08' }], 'topic', '2026-03-09'), false);
});

test('extractJsonObject handles markdown fenced JSON', () => {
  const raw = '```json\n{"a":1}\n```';
  assert.equal(extractJsonObject(raw), '{"a":1}');
});

test('wordCountFromHtml strips tags', () => {
  assert.equal(wordCountFromHtml('<h1>Hello</h1><p>world of law firm AI</p>'), 6);
});

test('shouldSkipRunForDay enforces duplicate guard', () => {
  assert.equal(shouldSkipRunForDay({ hasRunningRun: true, hasCompletedRunToday: false, force: false }), true);
  assert.equal(shouldSkipRunForDay({ hasRunningRun: false, hasCompletedRunToday: true, force: false }), true);
  assert.equal(shouldSkipRunForDay({ hasRunningRun: false, hasCompletedRunToday: true, force: true }), false);
});

test('canSendNewsletter only allows approved status', () => {
  assert.equal(canSendNewsletter('newsletter_approved'), true);
  assert.equal(canSendNewsletter('newsletter_draft_ready'), false);
});
