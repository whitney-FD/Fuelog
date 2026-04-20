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
| `notes` | string | no | Free text. Alias: `description`. Use for chef's notes or a freeform ingredient blurb when you don't have structured data. |
| `ingredients` | object[] or string | no | **Preferred: an array of ingredient objects (see below).** FuelLog will auto-compute all macro totals from the array and auto-save each ingredient to your library for reuse. If you pass a plain string, it's stored as notes. |
| `directions` | string | no | Step-by-step instructions. Newlines preserved. |
| `url` | string | no | Source link (displayed as a "View Original Recipe" button). |

> **All macros are totals for the entire recipe, not per serving.** The app divides by `servings` when logging one serving.

---

## Ingredient object shape

Pass an array on the recipe's `ingredients` field. FuelLog sums macros from these and stores each ingredient in your library so it's reusable in future recipes.

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | **yes** | e.g. `"chicken breast (raw)"`. |
| `qty` | number | yes (default `1`) | How many units used in this recipe. Aliases: `quantity`, `amount`. |
| `unit` | string | yes (default `"serving"`) | One of: `each`, `oz`, `lb`, `g`, `cup`, `tbsp`, `tsp`, `ml`, `serving`. |
| `cal` | number | yes | **Total** kcal for `qty × unit` in this recipe. Alias: `calories`. |
| `prot` | number | yes | Total protein (g). Alias: `protein`. |
| `carbs` | number | yes | Total carbs (g). |
| `fat` | number | yes | Total fat (g). |
| `fiber` | number | no | Total fiber (g). |
| `vita` | number | no | Vitamin A as % daily value. Aliases: `vitamin_a`, `vit_a`. |
| `iron` | number | no | Total iron (mg). |
| `sugar` | number | no | Total sugar (g). |
| `sodium` | number | no | Total sodium (mg). |

> Give macros as **totals for the quantity used**, not per unit. Example: `{"name":"chicken breast","qty":2,"unit":"lb","cal":600,"prot":120,"carbs":0,"fat":12}` means 2 lb of chicken contributes 600 kcal / 120 g protein to the recipe.

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
    "ingredients": [
      {"name":"chicken thigh (raw, boneless)","qty":2,"unit":"lb","cal":1600,"prot":205,"carbs":0,"fat":83,"fiber":0},
      {"name":"jasmine rice (cooked)","qty":3,"unit":"cup","cal":615,"prot":13,"carbs":135,"fat":1.2,"fiber":1.8},
      {"name":"bell pepper","qty":2,"unit":"each","cal":62,"prot":2,"carbs":14,"fat":0.4,"fiber":5},
      {"name":"red onion","qty":1,"unit":"each","cal":44,"prot":1.2,"carbs":10,"fat":0.1,"fiber":1.8},
      {"name":"olive oil","qty":3,"unit":"tbsp","cal":357,"prot":0,"carbs":0,"fat":40.5,"fiber":0}
    ],
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
>   "course": "breakfast|main|side|snack|dessert|none",
>   "cats": ["tag1","tag2"],
>   "ingredients": [
>     {"name":"chicken breast","qty":2,"unit":"lb","cal":<total>,"prot":<g>,"carbs":<g>,"fat":<g>,"fiber":<g>}
>   ],
>   "directions": "step 1...\nstep 2...",
>   "url": "source link or empty string"
> }]
> ```
>
> Rules:
> - Use the `ingredients` array — FuelLog auto-computes recipe totals from it.
> - For each ingredient, macros are TOTALS for the qty you list (not per unit).
> - Allowed units: `each`, `oz`, `lb`, `g`, `cup`, `tbsp`, `tsp`, `ml`, `serving`.
> - Use USDA FoodData Central values. Leave optional fields out if unknown rather than guessing.
> - Do not include per-serving amounts. Recipe-level totals are derived.
