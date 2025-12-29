const api = {
    getStrains: async () => {
        const response = await fetch('db/strains.json');
        const data = await response.json();
        return data;
    }
};

export default api;