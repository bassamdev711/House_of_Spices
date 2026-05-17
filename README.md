# TIF: The Art of Olfactory Light

[Arabic Version / النسخة العربية](./README_AR.md)

---


TIF is a high-performance, cinematic e-commerce platform dedicated to luxury fragrances. It integrates advanced 3D rendering with minimalist design principles to create an immersive digital boutique.

## Technical Architecture

### Core Technologies
- **Frontend Framework**: Next.js 16 (Turbopack optimized)
- **Programming Language**: TypeScript
- **Style Engine**: Tailwind CSS v4
- **3D Implementation**: Three.js & React Three Fiber (R3F)
- **Motion Orchestration**: Framer Motion
- **Interface Icons**: Lucide

### System Directory Structure
- `/app`: Centralized routing and page management.
- `/components`: Modular UI architecture (Hero, Products, Stats, About).
- `/lib`: Functional utilities including URI-encoded order management.
- `/public`: High-fidelity asset management for cinematic visuals.

## Distinctive Features

### 1. Kinetic Typography & Preloading
A minimalist gateway experience utilizing a rotating crystalline ring and precise scaling animations to maintain brand prestige during asset initialization.

### 2. Realistic 3D Visualization
Dynamic rendering of perfume vessels using real-time lighting environments, enabling a tactile sense of luxury within the browser environment.

### 3. Responsive Fluid Layout
A mobile-first horizontal snap-slider designed to replicate the experience of browsing a high-end physical portfolio.

### 4. Integrated Order Transmission
A secure utility for constructing structured product inquiries, facilitating direct communication via global messaging APIs.

## Deployment & Execution

### Development Environment
```bash
npm install
npm run dev
```

### Production Synthesis
```bash
npm run build
npm start
```

## Technical Guide for the "Kiro" Smart AI Assistant

The smart assistant **"Kiro"** has been upgraded and crafted as a premium, living interactive consultant for the "TIF" fragrance brand, fortified against heavy traffic and optimized to run with high limits on the free tier.

### 1. Architecture & Operational Flow
1. **Glassmorphic Chat Interface (`ChatWidget.tsx`)**:
   * A premium, blurry glass interface that enters the website **after a 3-second delay** with a spring-bouncing transition to ensure the user enjoys the platform's high-end preloader first.
   * Features a **custom-designed live SVG perfume bottle mascot** that interactively smiles and winks at the client every 4.5 seconds. Hovering over the button triggers an organic scaling reaction, expands its smile, and slightly elevates the perfume cap using high-fidelity CSS transitions.
   * Displays a temporary floating greeting bubble upon first entry, which elegantly fades out after 5 seconds.
2. **Active Context Memory (Chat History)**:
   * To prevent Kiro from forgetting the conversation context or repeating the greeting with every message, the frontend slices the **last 10 messages** of the chat history and includes it as a `history` payload in every API call.
3. **Request Processing Endpoint (`app/api/chat-agent/route.ts`)**:
   * Receives the new message along with the sliced conversation log.
   * Dynamically formats and maps the previous turns (`العميل` and `كيرو`) alongside the custom brand instructions (`lib/agent-prompt.ts`) into a single-turn request context for the Gemini API with a strict command to avoid repeating greetings.

### 2. Intelligent API Key Rotation
To circumvent Google's tight Free Tier limits, we implemented a background **Random Key Rotation** mechanism:
* **The Rotation Logic**: The system pulls the three keys (`GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`), filters out any undefined or empty values, and selects a random active key for each API request.
* **Resilient Fallback**: If no specific rotated keys are defined, the backend safely falls back to the default `GEMINI_API_KEY`, ensuring uninterrupted operation.
* **Advantage Comparison Table:**
  | Key Strategy | Model Target | Requests Per Minute (RPM) | Daily Request Limit (RPD) |
  | :--- | :--- | :--- | :--- |
  | Single Key (Before) | `gemini-2.5-flash` | 10 | 250 |
  | 3-Key Rotation (Current) | `gemini-2.5-flash-lite` | **45** | **3,000** |

### 3. Curation of `gemini-2.5-flash-lite` ⚡
* The active model endpoint was switched from `gemini-2.5-flash` to the highly optimized **`gemini-2.5-flash-lite`**.
* **Rationale**: Specifically engineered for high-concurrency chat, low latency, and efficient processing. It features a massive 1-million token context window and significantly relaxed limits on Google's Free Tier.

### 4. Applied Libraries & Framework Utilities 🛠
* **Icon Engine `lucide-react`**: Controls chat window navigation and inputs (`X`, `Send`) while removing generic star ornaments.
* **Micro-animations & CSS Compositing**:
  * Leverages custom hardware-accelerated animations (`float`, `glowBreath`, `slideIn`, `fadeInScale`).
  * Utilizes built-in **CSS Keyframes** and **React Component States** to control facial SVG expressions to bypass React 19 SSR hydration conflicts and deliver smooth 60fps animations.

---

© 2026 TIF. Developed with a focus on Quiet Luxury and Technical Excellence.
