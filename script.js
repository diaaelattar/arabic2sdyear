// تفعيل التنقل السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// تحديث شريط التقدم
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-indicator span');
    
    // في التطبيق الحقيقي، سيتم جلب هذه البيانات من التخزين المحلي
    const savedProgress = localStorage.getItem('courseProgress') || 25;
    
    progressFill.style.width = `${savedProgress}%`;
    progressText.textContent = `${savedProgress}%`;
}

// حفظ تقدم الدرس
function saveLessonProgress(lessonId, progress) {
    const lessonsProgress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}');
    lessonsProgress[lessonId] = progress;
    localStorage.setItem('lessonsProgress', JSON.stringify(lessonsProgress));
    
    // تحديث التقدم العام
    updateOverallProgress();
}

// تحديث التقدم العام
function updateOverallProgress() {
    const lessonsProgress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}');
    const totalLessons = 4;
    let totalProgress = 0;
    
    Object.values(lessonsProgress).forEach(progress => {
        totalProgress += progress;
    });
    
    const overallProgress = totalLessons > 0 ? Math.round(totalProgress / totalLessons) : 0;
    localStorage.setItem('courseProgress', overallProgress);
    
    updateProgress();
}

// تأثيرات عند التمرير
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
});

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    
    // تهيئة تقدم الدروس من التخزين المحلي
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach(card => {
        const lessonLink = card.querySelector('a');
        if(lessonLink) {
            const lessonId = lessonLink.getAttribute('href').split('/').pop().replace('.html', '');
            const savedProgress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}')[lessonId] || 0;
            
            const progressFill = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.lesson-progress span');
            
            if(progressFill && progressText) {
                progressFill.style.width = `${savedProgress}%`;
                progressText.textContent = `${savedProgress}% مكتمل`;
            }
        }
    });
    
    // إضافة تأثيرات للبطاقات
    const cards = document.querySelectorAll('.lesson-card, .exercise-category, .test-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// وظائف للاختبارات
class QuizManager {
    constructor() {
        this.quizzes = {};
        this.loadQuizzes();
    }
    
    loadQuizzes() {
        // في التطبيق الحقيقي، سيتم تحميل هذا من ملف JSON
        this.quizzes = {
            'lesson1': {
                title: 'اختبار الدرس الأول',
                questions: [
                    {
                        id: 1,
                        question: 'ماذا تعني كلمة "حَافِل" في نص "الوعي حماية"؟',
                        options: ['مملوء ومليء', 'فارغ وخالٍ', 'كبير وعظيم', 'صغير ومتواضع'],
                        correct: 0,
                        explanation: 'جاءت الكلمة في النص لتدل على أن التاريخ مليء بالنماذج المشرفة.'
                    }
                    // المزيد من الأسئلة...
                ],
                passingScore: 70
            }
        };
    }
    
    startQuiz(quizId) {
        if(this.quizzes[quizId]) {
            localStorage.setItem('currentQuiz', quizId);
            // في التطبيق الحقيقي، سيتم توجيه المستخدم إلى صفحة الاختبار
            alert(`بدء اختبار: ${this.quizzes[quizId].title}`);
        }
    }
    
    calculateScore(quizId, answers) {
        const quiz = this.quizzes[quizId];
        let score = 0;
        
        answers.forEach((answer, index) => {
            if(answer === quiz.questions[index].correct) {
                score++;
            }
        });
        
        const percentage = (score / quiz.questions.length) * 100;
        return {
            score: score,
            total: quiz.questions.length,
            percentage: percentage,
            passed: percentage >= quiz.passingScore
        };
    }
}

// إنشاء مثيل من مدير الاختبارات
const quizManager = new QuizManager();

// أضف هذه الدوال لتحسين تجربة الجوال
function initMobileOptimizations() {
    // منع التكبير المزدوج على iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // تحسين تجربة اللمس للأزرار
    const buttons = document.querySelectorAll('button, .btn, .btn-outline, .check-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        button.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
    
    // تحسين تجربة الإدخال
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // تأخير التمرير قليلاً للسماح بفتح لوحة المفاتيح
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // تحسين شريط التقدم للشاشات الصغيرة
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            bar.style.height = '10px';
        });
    }
}

// استدعاء التحسينات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initMobileOptimizations);