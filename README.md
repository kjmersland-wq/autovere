# AutoVere

CONTEXT:

AutoVere (autovere.com) is a premium, cross-border road trip intelligence platform and cost planner for Europe, the USA, and Canada. The platform helps travelers calculate exact toll costs, vignettes, fuel/charging, and ferries across multiple vehicle types: passenger cars, motorhomes/campervans, and touring motorcycles. 

The visual identity is modern, dark, trustworthy, and adventure-oriented (high-end travel aesthetics).

TASK:

Generate a photorealistic hero background image that represents this mission and implement it behind the hero planner with a dark gradient overlay.

IMAGE GENERATION PROMPT:

"Cinematic, ultra-realistic wide shot of a road-trip scenic overlook at dusk. Parked neatly on an asphalt scenic viewpoint: a sleek dark crossover SUV with a low-profile roof box, an adventure touring motorcycle (with panniers), and a modern campervan. Beside the viewpoint is a wide, pristine two-lane mountain highway with crisp road markings and steel safety barriers winding along a dramatic coastal fjord/mountain landscape into the distance. Moody twilight atmosphere with a warm golden-amber horizon and deep navy sky. Clean asphalt composition in the lower center to keep UI readable. Photorealistic automotive photography, 16:9 aspect ratio."

FRONTEND IMPLEMENTATION:

- Place the generated image as the hero background across all regions (/, /us, /ca).

- Apply a dark linear gradient overlay: `linear-gradient(180deg, rgba(10,15,29,0.55) 0%, rgba(10,15,29,0.75) 50%, rgba(10,15,29,0.95) 100%)` to ensure all input fields, text, and selector pills remain 100% sharp and readable.

- Use `object-fit: cover` and responsive centering across desktop and mobile.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/04574f97-2251-430f-ab70-f74178b3f230).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
