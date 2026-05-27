# 3D Login Page with Eye-Tracking Computer

An attractive, modern login page built with React featuring a 3D interactive scene. The computer's eyes smoothly follow your cursor movement, creating an engaging user experience.

## Features

✨ **3D Interactive Scene**
- Beautiful desk setup with computer, books, lamp, keyboard, mouse, and more
- Smooth eye-tracking - computer eyes follow cursor movement
- Isometric/low-poly aesthetic
- Optimized for performance

🎨 **Modern Login UI**
- Glassmorphism design with backdrop blur
- Smooth animations and transitions
- Responsive design
- Gradient accents

⚡ **Built with React**
- React 18 + Vite
- React Three Fiber for 3D rendering
- Three.js for 3D graphics
- Modern ES6+ JavaScript

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Scene3D.jsx      # 3D scene with computer and eye tracking
│   │   ├── LoginForm.jsx    # Login form component
│   │   └── LoginForm.css     # Login form styles
│   ├── App.jsx               # Main app component
│   ├── App.css               # App styles
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json              # Dependencies
└── vite.config.js           # Vite configuration
```

## Customization

### Adjust Eye Tracking Sensitivity

Edit `src/components/Scene3D.jsx`:

```javascript
const damping = 0.15      // Lower = smoother, slower (try 0.1-0.3)
const maxRotation = 0.4   // Maximum eye rotation (try 0.2-0.6)
```

### Change Colors

- **Computer eyes**: Edit the `color` and `emissive` properties in the Computer component
- **Login form**: Edit gradient colors in `LoginForm.css`
- **Background**: Edit gradient in `App.css`

### Add Authentication

Update the `handleSubmit` function in `LoginForm.jsx` to connect to your authentication API.

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **@react-three/drei** - Useful helpers for R3F

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Responsive design


Free to use for any project.