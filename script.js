document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const heroSection = document.getElementById('hero');
    const inputSection = document.getElementById('input-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');

    const btnBegin = document.getElementById('btn-begin');
    const btnGenerate = document.getElementById('btn-generate');
    const btnRestart = document.getElementById('btn-restart');

    const memoryInput = document.getElementById('memory-input');
    const emotionTags = document.querySelectorAll('.emotion-tag');
    const colorMoods = document.querySelectorAll('.color-mood');
    const imageUpload = document.getElementById('image-upload');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');

    const loadingProgress = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    const floatingWordsContainer = document.getElementById('floating-words-container');

    // --- State ---
    let selectedEmotions = [];
    let selectedMood = null;

    // --- Initialization ---
    setTimeout(() => {
        document.getElementById('hero-title').classList.add('visible');
        document.getElementById('hero-subtitle').classList.add('visible');
        document.getElementById('hero-button-container').classList.add('visible');
    }, 500);

    initCanvas();

    // --- Navigation ---
    btnBegin.addEventListener('click', () => {
        transitionSection(heroSection, inputSection);
    });

    btnRestart.addEventListener('click', () => {
        // Reset state
        selectedEmotions = [];
        selectedMood = null;
        memoryInput.value = '';
        emotionTags.forEach(t => t.classList.remove('selected'));
        colorMoods.forEach(m => m.classList.remove('selected'));
        imagePreview.classList.add('hidden');
        
        transitionSection(resultsSection, heroSection);
    });

    // --- Input Logic ---
    emotionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const emotion = tag.textContent;
            if (selectedEmotions.includes(emotion)) {
                selectedEmotions = selectedEmotions.filter(e => e !== emotion);
                tag.classList.remove('selected');
            } else {
                if (selectedEmotions.length < 3) {
                    selectedEmotions.push(emotion);
                    tag.classList.add('selected');
                }
            }
        });
    });

    colorMoods.forEach(mood => {
        mood.addEventListener('click', () => {
            colorMoods.forEach(m => m.classList.remove('selected'));
            selectedMood = mood.dataset.mood;
            mood.classList.add('selected');
        });
    });

    imageUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.querySelector('img').src = event.target.result;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Generation Logic ---
    btnGenerate.addEventListener('click', () => {
        if (!memoryInput.value.trim()) {
            alert('Please describe a memory first.');
            return;
        }
        
        startLoadingSequence();
    });

    function transitionSection(from, to) {
        gsap.to(from, { opacity: 0, y: -20, duration: 1, ease: 'power2.inOut', onComplete: () => {
            from.classList.add('hidden');
            from.classList.remove('active');
            to.classList.remove('hidden');
            to.classList.add('active');
            gsap.fromTo(to, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
        }});
    }

    function startLoadingSequence() {
        transitionSection(inputSection, loadingSection);
        
        const scentWords = ['rain', 'jasmine', 'cedarwood', 'old books', 'ocean air', 'vanilla', 'smoke', 'bergamot', 'sandalwood', 'lavender', 'petrichor', 'amber'];
        
        // Spawn floating words
        const interval = setInterval(() => {
            const word = scentWords[Math.floor(Math.random() * scentWords.length)];
            createFloatingWord(word);
        }, 400);

        // Progress bar
        gsap.to(loadingProgress, { width: '100%', duration: 6, ease: 'power1.inOut', onComplete: () => {
            clearInterval(interval);
            showResults();
        }});

        // Loading text changes
        const texts = ['Distilling memories...', 'Capturing emotions...', 'Extracting essence...', 'Formulating scent...'];
        let textIdx = 0;
        const textInterval = setInterval(() => {
            textIdx = (textIdx + 1) % texts.length;
            gsap.to(loadingText, { opacity: 0, duration: 0.5, onComplete: () => {
                loadingText.textContent = texts[textIdx];
                gsap.to(loadingText, { opacity: 1, duration: 0.5 });
            }});
        }, 1500);

        setTimeout(() => clearInterval(textInterval), 5500);
    }

    function createFloatingWord(text) {
        const word = document.createElement('div');
        word.className = 'floating-word';
        word.textContent = text;
        
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 80 + 10;
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        const tr = (Math.random() - 0.5) * 45;
        
        word.style.left = `${x}%`;
        word.style.top = `${y}%`;
        word.style.setProperty('--tx', `${tx}px`);
        word.style.setProperty('--ty', `${ty}px`);
        word.style.setProperty('--tr', `${tr}deg`);
        
        floatingWordsContainer.appendChild(word);
        
        setTimeout(() => word.remove(), 15000);
    }

    // --- AI Scent Engine ---
    async function generateScentData() {
        const memory = memoryInput.value;
        const emotions = selectedEmotions;
        const mood = selectedMood;
        const imageData = imagePreview.querySelector('img').src || null;
        
        let config = null;
        try {
            const response = await fetch('config.json');
            config = await response.json();
        } catch (error) {
            console.warn('无法加载配置文件，使用默认配置');
            config = { aiPriority: ['huggingface', 'fallback'] };
        }
        
        const providers = {
            huggingface: () => callHuggingFaceAPI(memory, emotions, mood, imageData, config?.huggingface),
            fallback: () => Promise.resolve(generateFallbackScentData(memory, emotions))
        };
        
        const priority = config?.aiPriority || ['huggingface', 'fallback'];
        
        for (const provider of priority) {
            try {
                console.log(`尝试使用 ${provider}...`);
                const result = await providers[provider]?.();
                if (result) {
                    console.log(`${provider} 成功！`);
                    return result;
                }
            } catch (error) {
                console.warn(`${provider} 失败:`, error.message);
                continue;
            }
        }
        
        console.error('所有AI服务均不可用');
        return generateFallbackScentData(memory, emotions);
    }

    async function callHuggingFaceAPI(memory, emotions, mood, imageData, config) {
        const textUrl = config?.textUrl || 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1';
        const visionUrl = config?.visionUrl || 'https://api-inference.huggingface.co/models/Salesforce/BLIP-image-captioning-base';
        const apiKey = config?.apiKey;
        const temperature = config?.temperature || 0.8;
        const maxTokens = config?.maxTokens || 500;
        
        let imageDescription = '';
        
        if (imageData && imageData.startsWith('data:image/')) {
            try {
                console.log('正在分析图片...');
                const base64Data = imageData.split(',')[1];
                const mimeType = imageData.split(';')[0].split(':')[1];
                
                const visionResponse = await fetch(visionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
                    },
                    body: JSON.stringify({
                        inputs: {
                            image: base64Data,
                            parameters: {
                                max_length: 50
                            }
                        }
                    })
                });
                
                if (visionResponse.ok) {
                    const visionData = await visionResponse.json();
                    imageDescription = visionData[0]?.generated_text || visionData?.generated_text || '';
                    if (imageDescription) {
                        console.log('图片描述:', imageDescription);
                    }
                } else {
                    console.warn('图片分析失败，继续使用文本输入');
                }
            } catch (error) {
                console.warn('图片分析异常:', error.message);
            }
        }
        
        const imageInfo = imageDescription ? `图片内容描述: ${imageDescription}` : '';
        
        const prompt = `你是一个专业的香水调香师。根据用户的记忆描述、情感、色彩偏好和图片内容（如果有），创造一个独特的香水配方。

用户记忆描述: "${memory}"
选择情感: ${emotions.join(', ') || '无'}
色彩偏好: ${mood || '无'}
${imageInfo}

请以JSON格式返回香水配方，包含以下字段：
{
    "name": "香水名称（简洁优雅，2-4个词）",
    "top": "前调（3-5种香料，用英文逗号分隔）",
    "middle": "中调（3-5种香料，用英文逗号分隔）", 
    "base": "后调（3-5种香料，用英文逗号分隔）",
    "description": "香水的诗意描述（2-3句话，富有情感和画面感）",
    "music": "建议的背景音乐风格",
    "palette": ["#HEX颜色1", "#HEX颜色2", "#HEX颜色3"]
}

要求：
1. 香水名称要富有诗意和记忆感
2. 香料选择要符合记忆的情感氛围
3. 颜色要体现香水的整体色调
4. 描述要富有诗意和情感
5. 只返回JSON，不要其他文字`;

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (apiKey && apiKey.trim()) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }
            
            const response = await fetch(textUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        temperature: temperature,
                        max_new_tokens: maxTokens,
                        do_sample: true
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`Hugging Face API error: ${response.status} - ${errorData?.error || 'Unknown error'}`);
            }

            const data = await response.json();
            const resultText = data[0]?.generated_text;
            
            if (!resultText) {
                throw new Error('Hugging Face API返回格式异常');
            }
            
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('无法从Hugging Face响应中提取JSON');
            }

            const scentData = JSON.parse(jsonMatch[0]);
            
            return {
                name: scentData.name,
                top: scentData.top,
                middle: scentData.middle,
                base: scentData.base,
                description: scentData.description,
                music: scentData.music,
                palette: scentData.palette
            };
        } catch (error) {
            console.error('Hugging Face API调用失败:', error);
            throw error;
        }
    }

    function generateFallbackScentData(memory, emotions) {
        const memoryLower = memory.toLowerCase();
        
        const database = [
            {
                keywords: ['rain', 'storm', 'water', 'ocean', 'beach'],
                name: 'Petrichor Dreams',
                top: 'Sea Salt, Bergamot',
                middle: 'White Jasmine, Rainwater',
                base: 'Wet Earth, Patchouli',
                description: 'A liquid memory of summer storms and the heavy scent of earth after rain.',
                music: 'Ambient: Thunder over the Coast',
                palette: ['#E0E7FF', '#94A3B8', '#475569']
            },
            {
                keywords: ['forest', 'wood', 'trees', 'cabin', 'mountain'],
                name: 'Cedar Sanctuary',
                top: 'Pine Needle, Juniper',
                middle: 'Smoked Wood, Leather',
                base: 'Cedarwood, Amber',
                description: 'The silent warmth of a wooden cabin hidden deep within an ancient forest.',
                music: 'Instrumental: Cello in the Woods',
                palette: ['#451A03', '#92400E', '#FDE68A']
            },
            {
                keywords: ['book', 'library', 'paper', 'read', 'study'],
                name: 'Vellum & Ink',
                top: 'White Pepper, Saffron',
                middle: 'Old Paper, Dried Rose',
                base: 'Vanilla, Sandalwood',
                description: 'Nostalgia bound in leather, the scent of stories waiting to be rediscovered.',
                music: 'Lo-fi: Quiet Library Hours',
                palette: ['#F5F5F0', '#D4D4D4', '#A3A3A3']
            },
            {
                keywords: ['home', 'kitchen', 'bake', 'cookie', 'bread', 'warmth'],
                name: 'Heirloom Kitchen',
                top: 'Sweet Orange, Cardamom',
                middle: 'Cinnamon Bark, Honey',
                base: 'Roasted Vanilla, Musk',
                description: 'The golden hour of childhood, filled with the warmth of baking and love.',
                music: 'Jazz: Sunday Morning Kitchen',
                palette: ['#FCD34D', '#F59E0B', '#B45309']
            },
            {
                keywords: ['garden', 'flower', 'spring', 'field', 'meadow'],
                name: 'Meadow Echo',
                top: 'Green Leaf, Lemon Peel',
                middle: 'Wild Iris, Muguet',
                base: 'White Musk, Vetiver',
                description: 'A fleeting whisper of spring flowers carried on a gentle morning breeze.',
                music: 'Classical: Vivaldi Spring Reimagined',
                palette: ['#DCFCE7', '#86EFAC', '#22C55E']
            }
        ];

        let result = database[Math.floor(Math.random() * database.length)];

        for (const profile of database) {
            if (profile.keywords.some(k => memoryLower.includes(k))) {
                result = profile;
                break;
            }
        }

        if (emotions.includes('nostalgic')) result.description += ' Tinged with a deep sense of longing.';
        if (emotions.includes('peaceful')) result.description = 'A serene interpretation: ' + result.description;
        if (emotions.includes('lonely')) result.base += ', Cold Ash';

        return result;
    }

    async function showResults() {
        const data = await generateScentData();
        
        document.getElementById('result-name').textContent = data.name;
        document.getElementById('result-title').textContent = data.name;
        document.getElementById('result-description').textContent = `"${data.description}"`;
        document.getElementById('result-top').textContent = data.top;
        document.getElementById('result-middle').textContent = data.middle;
        document.getElementById('result-base').textContent = data.base;
        document.getElementById('result-music').textContent = data.music;

        const paletteContainer = document.getElementById('result-palette');
        paletteContainer.innerHTML = '';
        data.palette.forEach(color => {
            const div = document.createElement('div');
            div.className = 'w-6 h-6 rounded-full border border-black/5';
            div.style.backgroundColor = color;
            paletteContainer.appendChild(div);
        });

        setupShareButtons(data);
        transitionSection(loadingSection, resultsSection);
    }

    function setupShareButtons(data) {
        const shareTwitter = document.getElementById('share-twitter');
        const shareInstagram = document.getElementById('share-instagram');
        const shareCopy = document.getElementById('share-copy');
        const shareFeedback = document.getElementById('share-feedback');

        const shareText = `I created "${data.name}" on EchoScent. A unique fragrance inspired by my memories. #EchoScent`;
        const shareUrl = window.location.href;

        shareTwitter.addEventListener('click', () => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank');
        });

        shareInstagram.addEventListener('click', () => {
            showFeedback('Instagram sharing coming soon');
        });

        shareCopy.addEventListener('click', async () => {
            try {
                const copyText = `EchoScent - ${data.name}\n\nTop Notes: ${data.top}\nMiddle Notes: ${data.middle}\nBase Notes: ${data.base}\n\n${data.description}\n\n${shareUrl}`;
                await navigator.clipboard.writeText(copyText);
                showFeedback('Copied to clipboard!');
            } catch (err) {
                showFeedback('Copy failed, try again');
            }
        });

        function showFeedback(message) {
            shareFeedback.textContent = message;
            shareFeedback.style.opacity = '1';
            setTimeout(() => {
                shareFeedback.style.opacity = '0';
            }, 2000);
        }
    }

    // --- Background Animation ---
    function initCanvas() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 100 + 50,
                opacity: Math.random() * 0.3
            });
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < -p.size) p.x = width + p.size;
                if (p.x > width + p.size) p.x = -p.size;
                if (p.y < -p.size) p.y = height + p.size;
                if (p.y > height + p.size) p.y = -p.size;

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                grad.addColorStop(0, `rgba(197, 160, 89, ${p.opacity})`);
                grad.addColorStop(1, 'rgba(245, 245, 240, 0)');
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }

        animate();
    }
});
