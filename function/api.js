export async function fetchJSON(url, options = {}) {
    try { 
    const headers =  {Accept: 'application/json', ...options.headers};
    const response = await fetch(url, {...options, headers});
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Server Error')
    }
    } catch (error) {
        throw new Error('Request failed', { cause: error});
    }
}
