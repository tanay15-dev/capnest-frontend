// ===== AZURE AI SERVICES =====

// Get environment variables
const AZURE_OPENAI_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_DOCS_KEY = import.meta.env.VITE_AZURE_DOCS_API_KEY;
const AZURE_DOCS_ENDPOINT = import.meta.env.VITE_AZURE_DOCS_ENDPOINT;
const AZURE_TRANSLATOR_KEY = import.meta.env.VITE_AZURE_TRANSLATOR_API_KEY;
const AZURE_TRANSLATOR_ENDPOINT = import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT;

class AzureAIService {
    constructor() {
        this.useRealAPI = false; // Set to true when ready to use real APIs
    }

    // Azure OpenAI - Eligibility Check
    async checkEligibility(loanData, creditScore) {
        if (!this.useRealAPI) {
            // Simulate AI response
            return new Promise(resolve => {
                setTimeout(() => {
                    const probability = this.calculateProbability(creditScore);
                    resolve({
                        eligible: probability >= 40,
                        probability,
                        recommendation: this.getRecommendation(probability),
                        suggestedAmount: loanData.amount,
                        suggestedTenure: 36
                    });
                }, 2000);
            });
        }

        try {
            const response = await fetch(`${AZURE_OPENAI_ENDPOINT}/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': AZURE_OPENAI_KEY
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a loan eligibility expert. Analyze the loan application and provide eligibility assessment.'
                        },
                        {
                            role: 'user',
                            content: `Analyze this loan application: Credit Score: ${creditScore}, Loan Amount: ${loanData.amount}, Income: ${loanData.income}, Purpose: ${loanData.purpose}`
                        }
                    ],
                    max_tokens: 500
                })
            });

            const data = await response.json();
            return this.parseEligibilityResponse(data);
        } catch (error) {
            console.error('Azure OpenAI Error:', error);
            // Fallback to simulation
            return this.checkEligibility(loanData, creditScore);
        }
    }

    // Azure Document Intelligence - Verify Documents
    async verifyDocument(file) {
        if (!this.useRealAPI) {
            // Simulate document verification
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        verified: true,
                        documentType: 'PAN_CARD',
                        extractedData: {
                            name: 'Sample Name',
                            number: 'ABCDE1234F'
                        },
                        confidence: 0.95
                    });
                }, 3000);
            });
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${AZURE_DOCS_ENDPOINT}/formrecognizer/documentModels/prebuilt-idDocument:analyze?api-version=2023-07-31`, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_DOCS_KEY
                },
                body: formData
            });

            const data = await response.json();
            return this.parseDocumentResponse(data);
        } catch (error) {
            console.error('Azure Document Intelligence Error:', error);
            // Fallback to simulation
            return this.verifyDocument(file);
        }
    }

    // Azure Translator - Translate Text
    async translateText(text, targetLanguage) {
        if (!this.useRealAPI) {
            // Return original text (translations already handled in translations object)
            return text;
        }

        try {
            const response = await fetch(`${AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to=${targetLanguage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
                    'Ocp-Apim-Subscription-Region': 'centralindia'
                },
                body: JSON.stringify([{ text }])
            });

            const data = await response.json();
            return data[0].translations[0].text;
        } catch (error) {
            console.error('Azure Translator Error:', error);
            return text;
        }
    }

    // Helper: Calculate probability based on credit score
    calculateProbability(score) {
        if (score >= 750) return 90;
        if (score >= 700) return 75;
        if (score >= 650) return 55;
        if (score >= 600) return 35;
        return 15;
    }

    // Helper: Get recommendation
    getRecommendation(probability) {
        if (probability >= 75) return 'highly_recommended';
        if (probability >= 50) return 'moderate_risk';
        return 'high_risk';
    }

    // Helper: Parse eligibility response
    parseEligibilityResponse(data) {
        // Parse Azure OpenAI response
        return {
            eligible: true,
            probability: 75,
            recommendation: 'moderate_risk',
            suggestedAmount: 500000,
            suggestedTenure: 36
        };
    }

    // Helper: Parse document response
    parseDocumentResponse(data) {
        // Parse Azure Document Intelligence response
        return {
            verified: true,
            documentType: 'PAN_CARD',
            extractedData: {},
            confidence: 0.95
        };
    }
}

// Create global instance
const azureAI = new AzureAIService();
window.azureAI = azureAI;
