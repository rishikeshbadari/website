var TMDB_API_KEY = process.env.TMDB_API_KEY || '';

module.exports = async function handler(req, res) {
    var path = req.query.path;
    if (!path) {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB API key not configured' });
    }

    try {
        var separator = path.indexOf('?') >= 0 ? '&' : '?';
        var url = 'https://api.themoviedb.org/3/' + path + separator + 'api_key=' + TMDB_API_KEY;
        var response = await fetch(url);
        var data = await response.json();

        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: 'TMDB request failed' });
    }
};
