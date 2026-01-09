// API Service for CapNest Backend
// Using relative path since backend and frontend are on same server
const API_BASE_URL = '/api';

class APIService {
    async checkEligibility(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/check-eligibility`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async analyzeDocument(file) {
        try {
            const formData = new FormData();
            formData.append('document', file);

            const response = await fetch(`${API_BASE_URL}/analyze-document`, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getLoanRecommendations(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/loan-recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { status: 'error', message: error.message };
        }
    }
}

// Export singleton instance
const apiService = new APIService();
window.apiService = apiService;
