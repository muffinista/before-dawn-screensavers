// Fetches the parameters in the query url. I hope this works...
const 
    urlParams = new URLSearchParams(window.location.search);

// Puts the values in variables
    secs = urlParams.get('secs');
    borderStyle = urlParams.get('borderStyle');