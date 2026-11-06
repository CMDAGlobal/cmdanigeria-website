import { createFileRoute } from "@tanstack/react-router";

import { NewsletterIssue, type NewsletterIssueData } from "@/components/site/NewsletterIssue";

/**
 * Design preview for the block-composed Prescription newsletter. This is
 * sample content only — real issues come from Sanity (`prescription` documents)
 * and render at /publications/$slug. Kept noindex and unlinked from the site.
 */
const SAMPLE_ISSUE: NewsletterIssueData = {
  title: "The Whole Person",
  issueNumber: 66,
  issueDate: "2026-11-01",
  author: "CMDA Nigeria Editorial",
  summary:
    "Mental health, mission hospitals and the quiet, patient work of caring for people — body, mind and spirit — across Nigeria.",
  coverUrl: "/gallery/ifehl/ifehl-01.webp",
  coverAlt: "CMDA members gathered at an IfeHl outreach",
  body: [
    {
      _type: "block",
      _key: "intro",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Welcome to the sixty-sixth issue of The Prescription. This month we follow one idea through every page: that Christian healthcare is never only about the body. It is about the whole person — and the whole community around them.",
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-president",
      style: "h2",
      markDefs: [],
      children: [{ _type: "span", marks: [], text: "A word from the President" }],
    },
    {
      _type: "block",
      _key: "president-1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Every clinic we run begins with a prayer and ends with a conversation. Between those two moments, a great deal of medicine happens — but so does something harder to measure. A patient who has been listened to will often tell you that the listening was the treatment.",
        },
      ],
    },
    {
      _type: "block",
      _key: "president-quote",
      style: "blockquote",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "“We do not treat diseases. We care for people who happen to have them.”",
        },
      ],
    },
    {
      _type: "block",
      _key: "president-2",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "That conviction is why our chapters keep showing up in places where the equipment is old and the queues are long. It is also why we are investing this year in training for mental health first aid — because the person in front of you is rarely carrying only one burden.",
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-field",
      style: "h2",
      markDefs: [],
      children: [{ _type: "span", marks: [], text: "From the field: IfeHl at ten" }],
    },
    {
      _type: "block",
      _key: "field-1",
      style: "normal",
      markDefs: [{ _type: "link", _key: "field-link", href: "/ministries/ifehl" }],
      children: [
        { _type: "span", marks: [], text: "Ten years ago a handful of doctors began " },
        { _type: "span", marks: ["field-link"], text: "a weekly outreach in Ile-Ife" },
        {
          _type: "span",
          marks: [],
          text: ". Today the team runs clinics, school screenings and a growing community health programme. What began as a gesture has become an institution — and the photographs on this page tell the story better than any report.",
        },
      ],
    },
    {
      _type: "image",
      _key: "field-photo",
      asset: { url: "/gallery/ifehl/ifehl-04.webp" },
      alt: "Health screening at an IfeHl community outreach",
      caption: "A community screening in Ile-Ife, photographed by the IfeHl team.",
    },
    {
      _type: "block",
      _key: "h3-numbers",
      style: "h3",
      markDefs: [],
      children: [{ _type: "span", marks: [], text: "What the numbers say" }],
    },
    {
      _type: "block",
      _key: "numbers-1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Across the country last quarter, chapter volunteers recorded:",
        },
      ],
    },
    {
      _type: "block",
      _key: "stat-1",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        { _type: "span", marks: [], text: "2,140 patients seen at free community clinics" },
      ],
    },
    {
      _type: "block",
      _key: "stat-2",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        { _type: "span", marks: [], text: "318 health workers trained in mental health first aid" },
      ],
    },
    {
      _type: "block",
      _key: "stat-3",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "41 secondary schools reached with screening and teaching",
        },
      ],
    },
    {
      _type: "block",
      _key: "callout",
      style: "callout",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "The next national medical mission is 14–21 February 2027. Chapter coordinators should submit team lists by 15 January.",
        },
      ],
    },
    {
      _type: "block",
      _key: "h2-diary",
      style: "h2",
      markDefs: [],
      children: [{ _type: "span", marks: [], text: "Dates for your diary" }],
    },
    {
      _type: "block",
      _key: "diary-1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Regional meetings continue through November, and the annual Doctors' Retreat returns to Ibadan in early December. Both are open to members and students — bring a colleague who has never been.",
        },
      ],
    },
    {
      _type: "block",
      _key: "rule",
      style: "divider",
      markDefs: [],
      children: [],
    },
    {
      _type: "block",
      _key: "closing",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Thank you for reading, for praying and for practising with compassion. We will be back next month.",
        },
      ],
    },
  ],
};

export const Route = createFileRoute("/publications/prescription-preview")({
  component: PrescriptionPreviewPage,
  head: () => ({
    meta: [
      { title: "The Prescription — design preview | CMDA Nigeria" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "A design preview of The Prescription, the monthly newsletter of CMDA Nigeria.",
      },
    ],
  }),
});

function PrescriptionPreviewPage() {
  return <NewsletterIssue issue={SAMPLE_ISSUE} />;
}
