# FuelLog — Bulk Recipe Import Fields

Paste a **JSON array** into the **Bulk Import Recipes** modal (Log tab → "⬆ Bulk").
Each element is one recipe. Unknown fields are ignored. Duplicates (by lower-cased `name`) are skipped.

---

## Recipe fields

| Field | Type | Required | Notes / aliases accepted |
|---|---|---|---|
| `name` | string | **yes** | Display name. Empty name → entry is skipped. |
| `servings` | number | no (default `1`) | Number of servings the recipe yields. |
| `cal` | number | no (default `0`) | Total calories for the whole recipe. Aliases: `calories`, `kcal`. |
| `prot` | number | no (default `0`) | Total protein (g). Aliases: `protein`, `proteins`. |
| `carbs` | number | no (default `0`) | Total carbs (g). Aliases: `carbohydrates`, `carb`. |
| `fat` | number | no (default `0`) | Total fat (g). Aliases: `fats`, `lipids`. |
| `fiber` | number | no (default `0`) | Total fiber (g). Aliases: `fibre`, `dietary_fiber`. |
| `sugar` | number | no | Total sugar (g). |
| `sodium` | number | no | Total sodium (mg). |
| `iron` | number | no | Total iron (mg). |
| `vita` | number | no | Vitamin A as **% daily value**. Alias: `vitamin_a`. |
| `course` | string | no (default `"main"`) | One of: `breakfast`, `main`, `side`, `snack`, `dessert`, `none`. Anything else → `main`. |
| `cats` | string[] | no | Tags like `["chicken","casserole"]`. Aliases: `tags`, `categories`. A comma-separated string works too. |
| `notes` | string | no | Free text. Aliases: `ingredients`, `description` — use this for your ingredient list. |
| `directions` | string | no | Step-by-step instructions. Newlines preserved. |
| `url` | string | no | Source link (displayed as a "View Original Recipe" button). |

> **All macros are totals for the entire recipe, not per serving.** The app divides by `servings` when logging one serving.

---

## Canonical example

```json
[
  {
    "name": "Sheet-Pan Chicken Bowls",
    "servings": 8,
    "cal": 2080, "prot": 288, "carbs": 72, "fat": 72, "fiber": 32,
    "sugar": 14, "sodium": 2400, "iron": 9, "vita": 85,
    "course": "main",
    "cats": ["chicken","casserole","meal-prep"],
    "notes": "2 lb chicken thigh · 1 cup jasmine rice · 2 bell peppers · 1 red onion · 3 tbsp olive oil · 1 tbsp smoked paprika · 2 tsp garlic powder · salt & pepper",
    "directions": "1) Preheat oven to 425°F.\n2) Toss chicken + veg with oil and spices.\n3) Roast 25 min.\n4) Serve over rice.",
    "url": "https://example.com/chicken-bowls"
  },
  {
    "name": "Chocolate Tahini Overnight Oats",
    "servings": 1,
    "cal": 420, "prot": 22, "carbs": 55, "fat": 14, "fiber": 10,
    "course": "breakfast",
    "cats": ["breakfast","vegetarian","no-cook"],
    "notes": "1/2 cup rolled oats · 1 cup oat milk · 1 tbsp cocoa · 1 tbsp tahini · 1 tsp maple · pinch salt",
    "directions": "Stir, refrigerate overnight, top with berries."
  }
]
```

---

## Prompt snippet for your chat app

Copy-paste this into your recipe chat so it returns data in the right shape:

> When I share recipes, respond with **only** a JSON array matching this schema — no prose, no markdown fences:
>
> ```
> [{
>   "name": "...",
>   "servings": <int>,
>   "cal": <total kcal>, "prot": <g>, "carbs": <g>, "fat": <g>, "fiber": <g>,
>   "sugar": <g>, "sodium": <mg>, "iron": <mg>, "vita": <% DV>,
>   "course": "breakfast|main|side|snack|dessert|none",
>   "cats": ["tag1","tag2"],
>   "notes": "ingredient list separated by ' · '",
>   "directions": "step 1...\nstep 2...",
>   "url": "source link or empty string"
> }]
> ```
>
> All macro values are totals for the whole recipe (NOT per serving). Use USDA FoodData Central values. `vita` is Vitamin A as a % of daily value. Leave optional fields out if unknown rather than guessing.
