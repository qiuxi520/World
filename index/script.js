//  particles.js 的配置，用于创建一个动态粒子背景效果。
particlesJS("particles-js",
    {
        // 粒子基本设置
        "particles":
        {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#06FAFE" },
            // "shape": { "type": "circle" }, // 也可以是 "triangle"、"star" 等
            "shape": { "type": "star" },
            "opacity": { "value": 0.5 },
            "size": { "value": 3, "random": true },
            "line_linked":
            {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": { "enable": true, "speed": 4 }
        },
        // 交互设置
        "interactivity":
        {
            "events":
            {
                "onhover": { "enable": true, "mode": "repulse" }, // 鼠标悬停 mode: "repulse" → 鼠标靠近时粒子会 排斥（远离鼠标）
                "onclick": { "enable": true, "mode": "push" }, // 鼠标点击 mode: "push" → 点击时 新增粒子
                "resize": true
            },
            "modes":
            {
                "repulse": { "distance": 100, "duration": 0.4 },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true // 视网膜屏幕优化
});

// Mouse trail effect
const canvas = document.getElementById("trail-canvas"); // 获取 HTML 中 <canvas id="trail-canvas"> 元素
const ctx = canvas.getContext("2d"); //  获取 Canvas 的 2D 绘图上下文，用于绘制图形（如粒子、线条等）

// 让 Canvas 铺满整个浏览器窗口
function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas); // 当用户 调整浏览器窗口大小时，自动调用 resizeCanvas()，确保 Canvas 始终全屏
resizeCanvas(); // 立即执行一次 resizeCanvas()，让 Canvas 在页面加载时就铺满屏幕


// 创建一个空数组 particles，用于存储所有生成的粒子对象
let particles = [];
// 当鼠标在页面上移动时，触发回调函数，参数 e 是事件对象，包含鼠标位置等信息（如 e.clientX、e.clientY）,只负责 生成粒子
document.addEventListener("mousemove", (e) => {
    // 每次鼠标移动时，循环 3 次，向 particles 数组中添加 3 个新粒子对象
    for (let i = 0; i < 1; i++) {
        particles.push({
            // 粒子的初始坐标（鼠标当前位置）
            x: e.clientX,
            y: e.clientY,
            radius: Math.random() * 4 + 4, // 	粒子半径（4px ~ 8px 之间的随机值）
            color: `hsl(${Math.random() * 60 + 20}, 100%, 50%)`, // 粒子颜色（HSL 色彩模式，生成橙红黄色调，20-80 的色相范围）
            alpha: 1, // 初始透明度（1 = 完全不透明，后续会递减实现淡出效果）
            // X Y轴速度（-1 ~ 1 之间的随机值，控制粒子左右随机运动）
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2,
            shrinkRate: 0.96 // 收缩率（每帧粒子半径乘以 0.96，逐渐变小）
        });
    }
});

// 通过 动画循环 实现了粒子系统的动态效果
function animate()
{
    // 请求浏览器在下一帧继续调用 animate 函数，形成平滑的动画循环
    requestAnimationFrame(animate);
   
    // 创建拖尾效果
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // 设置填充颜色为半透明黑色
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 用该颜色覆盖整个画布，形成“渐隐”拖尾效果（透明度 0.15 控制残留痕迹的强弱）

    // 更新并绘制所有粒子
    particles.forEach((p, i) => {
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.radius *= p.shrinkRate;
        p.alpha -= 0.02;

        // 移除消失的粒子
        if (p.alpha <= 0 || p.radius <= 0.5) {
            particles.splice(i, 1);
            return;
        }

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRGB(p.color)}, ${p.alpha})`;
        ctx.fill();
        //  console.log("HSL:", p.color, "-> RGB:", hexToRGB(p.color));
    });
}

animate();

// Helper: Convert HSL color to RGB string
function hexToRGB(hslColor)
{
    const hslMatch = hslColor.match(/hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
    if (!hslMatch) return "255,255,255";
    const h = Number(hslMatch[1]);
    const s = Number(hslMatch[2]) / 100;
    const l = Number(hslMatch[3]) / 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
    else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
    else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
    else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
    else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
    else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `${r},${g},${b}`;
}