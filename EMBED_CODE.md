# Embed Code Reference

## Option 1: Three.js Standalone (Recommended - Works Immediately)

Simply copy the entire `index.html` file. It's completely self-contained and works out of the box.

**Features:**
- ✅ No build step required
- ✅ No external dependencies (uses CDN)
- ✅ Smooth eye tracking with damping
- ✅ Optimized for performance
- ✅ Responsive design

## Option 2: Spline Viewer Embed Code

If you're using Spline (spline.design) to create your scene, use this embed code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spline Viewer - Eye Tracking</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        spline-viewer {
            width: 100%;
            height: 100%;
            display: block;
        }
    </style>
</head>
<body>
    <spline-viewer 
        url="YOUR_SPLINE_SCENE_URL"
        events-target="global"
        events-types="mouse"
    ></spline-viewer>
    
    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.0/build/spline-viewer.js"></script>
    
    <script type="module">
        const splineViewer = document.querySelector('spline-viewer');
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        splineViewer.addEventListener('load', () => {
            const spline = splineViewer.spline;
            const leftEye = spline.findObjectByName('LeftEye');
            const rightEye = spline.findObjectByName('RightEye');
            
            if (leftEye && rightEye) {
                let currentX = 0, currentY = 0;
                const damping = 0.15;
                const maxRot = 0.3;
                
                function update() {
                    const targetX = Math.max(-maxRot, Math.min(maxRot, mouseX * maxRot));
                    const targetY = Math.max(-maxRot, Math.min(maxRot, mouseY * maxRot));
                    
                    currentX += (targetX - currentX) * damping;
                    currentY += (targetY - currentY) * damping;
                    
                    leftEye.rotation.y = currentX;
                    leftEye.rotation.x = currentY;
                    rightEye.rotation.y = currentX;
                    rightEye.rotation.x = currentY;
                    
                    requestAnimationFrame(update);
                }
                update();
            }
        });
    </script>
</body>
</html>
```

### Spline Setup Instructions:

1. **Create your scene in Spline:**
   - Design your robot/character
   - Create two separate objects for the eyes
   - Name them exactly: `LeftEye` and `RightEye` (case-sensitive)

2. **Export/Publish:**
   - Export your scene or publish it
   - Get the scene URL or `.splinecode` file path

3. **Replace the URL:**
   - Replace `YOUR_SPLINE_SCENE_URL` with your actual Spline scene URL
   - Or use: `url="./your-scene.splinecode"` for local files

4. **Eye Object Requirements:**
   - Each eye should be a separate object/group
   - Eyes should be positioned correctly in your character
   - The script will rotate them around their local origin

## Customization

### Adjust Eye Tracking Sensitivity

**In Three.js version (`index.html`):**
```javascript
const damping = 0.15;      // Lower = smoother, slower (try 0.1-0.3)
const maxRotation = 0.3;   // Maximum eye rotation in radians (try 0.2-0.5)
```

**In Spline Viewer version:**
```javascript
const damping = 0.15;      // Same as above
const maxRot = 0.3;        // Same as above
```

### Performance Tips

- Keep geometry simple (low poly count)
- Use efficient materials
- Limit the number of lights
- The Three.js version is already optimized with:
  - Pixel ratio capped at 2
  - Efficient animation loop
  - Optimized geometry

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Works (touch events can be added)

## Troubleshooting

**Eyes not tracking:**
- Check that eye objects are named correctly
- Verify mouse events are firing (check console)
- Ensure Spline scene is loaded before accessing objects

**Performance issues:**
- Reduce `maxRotation` value
- Lower geometry complexity
- Reduce number of lights
- Check browser console for errors
