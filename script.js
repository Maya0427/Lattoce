document.addEventListener('DOMContentLoaded', () => {

    // カードのドラッグ＆ドロップ機能
    const cards = document.querySelectorAll('.draggable-card');

    cards.forEach(card => {
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;

        card.addEventListener('pointerdown', (e) => {
            isDragging = true;
            card.setPointerCapture(e.pointerId);

            startX = e.clientX;
            startY = e.clientY;
            initialLeft = card.offsetLeft;
            initialTop = card.offsetTop;

            // クリックしたカードを最前面へ移動
            document.querySelectorAll('.draggable-card').forEach(c => c.style.zIndex = '1');
            card.style.zIndex = '100';
        });

        card.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            card.style.left = `${initialLeft + dx}px`;
            card.style.top = `${initialTop + dy}px`;
        });

        const stopDrag = (e) => {
            if (isDragging) {
                isDragging = false;
                card.releasePointerCapture(e.pointerId);
            }
        };

        card.addEventListener('pointerup', stopDrag);
        card.addEventListener('pointercancel', stopDrag);
    });

    // メインビジュアルのドット・ネットワークアニメーション
    const canvas = document.getElementById('network');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const points = Array.from({ length: 30 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6
        }));

        function animate() {
            ctx.clearRect(0, 0, width, height);

            points.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#e05638';
                ctx.fill();
            });

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.strokeStyle = `rgba(224, 86, 56, ${1 - dist / 130})`;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
});