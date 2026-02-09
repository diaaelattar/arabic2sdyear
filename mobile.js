// تحسينات متقدمة للجوال
class MobileOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupTouchEvents();
        this.optimizeForms();
        this.enhanceScrolling();
        this.detectOrientation();
    }
    
    setupTouchEvents() {
        // تحسين الأزرار لللمس
        document.querySelectorAll('[data-touch]').forEach(element => {
            element.addEventListener('touchstart', this.handleTouchStart);
            element.addEventListener('touchend', this.handleTouchEnd);
        });
    }
    
    handleTouchStart(e) {
        this.style.transform = 'scale(0.95)';
        this.style.transition = 'transform 0.1s';
    }
    
    handleTouchEnd(e) {
        this.style.transform = 'scale(1)';
    }
    
    optimizeForms() {
        // إضافة خاصية autocomplete للأجهزة المحمولة
        document.querySelectorAll('input').forEach(input => {
            if (!input.getAttribute('autocomplete')) {
                input.setAttribute('autocomplete', 'off');
            }
        });
    }
    
    enhanceScrolling() {
        // تحسين التمرير السلس
        if ('scrollBehavior' in document.documentElement.style) {
            // المتصفح يدعم التمرير السلس
            return;
        }
        
        // تنفيذ بديل للتمرير السلس
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    detectOrientation() {
        // التعامل مع تغيير الاتجاه
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        });
    }
}

// تهيئة محسن الجوال عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    new MobileOptimizer();
});