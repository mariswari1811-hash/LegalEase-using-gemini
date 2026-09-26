// Replace with your actual Gemini API Key (keep this secure in a backend environment for production)
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const inputArea = document.getElementById('legalInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const outputSection = document.getElementById('outputSection');
    const outputContent = document.getElementById('outputContent');

    const userQuery = inputArea.value.trim();

    if (!userQuery) {
        alert('Please enter or paste legal text to analyze.');
        return;
    }

    // UI Feedback: Loading state
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
    outputSection.style.display = 'block';
    outputContent.textContent = 'Processing document with Gemini AI...';

    // Construct prompt tailored for LegalEase
    const prompt = `
You are LegalEase, an expert AI assistant that simplifies legal documents. 
Analyze the following legal text and provide:
1. A plain-English summary.
2. Key terms or clauses broken down in bullet points.
3. Potential risks or notable conditions to be aware of.

Legal Text:
"${userQuery}"
`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Extract output text from response
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (resultText) {
            outputContent.textContent = resultText;
        } else {
            outputContent.textContent = 'No response generated. Please try again.';
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        outputContent.textContent = 'An error occurred while analyzing the text. Check your API key and connection.';
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze with Gemini';
    }
});
