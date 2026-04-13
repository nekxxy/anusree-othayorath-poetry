# അനുശ്രീ ഒതയോരത്ത് — കവിതകൾ
### Anusree Othayorath — Malayalam Poetry

**Live site:** https://nekxxy.github.io/anusree-othayorath-poetry

---

## How to add a new poem

Open `poems.js` and add a new entry to the `poems` array:

```js
{
  id: "unique-id-in-english",        // e.g. "mazha-1" or "poem-moonlight"
  title: "കവിതയുടെ പേര്",           // Malayalam title
  date: "2025-04-13",               // Date (YYYY-MM-DD)
  category: "പ്രകൃതി",              // Optional category tag
  lines: [
    "ആദ്യ വരി ഇവിടെ,",
    "രണ്ടാം വരി ഇവിടെ,",
    "",                             // ← empty string = stanza break
    "അടുത്ത ഭാഗം ഇവിടെ."
  ]
}
```

Save the file, commit and push — the site updates automatically.

---

## Categories (suggested)
- പ്രകൃതി (Nature)
- സ്നേഹം (Love)
- ഓർമ്മ (Memory)
- ജീവിതം (Life)
- ദൈവം (God/Devotion)
